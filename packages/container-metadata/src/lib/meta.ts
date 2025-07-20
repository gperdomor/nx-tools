/* eslint-disable @typescript-eslint/no-explicit-any */
import { RunnerContext as Context, RepoMetadata } from '@nx-tools/ci-context';
import { interpolate, logger as L, tmpDir } from '@nx-tools/core';
import * as pep440 from '@renovatebot/pep440';
import * as handlebars from 'handlebars';
import moment from 'moment-timezone';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as semver from 'semver';
import { Inputs } from './context';
import * as fcl from './flavor';
import * as icl from './image';
import * as tcl from './tag';

export interface Version {
  main: string | undefined;
  partial: string[];
  latest: boolean | undefined;
}

export class Meta {
  public readonly version: Version;

  private readonly inputs: Inputs;
  private readonly context: Context;
  private readonly repo: RepoMetadata;
  private readonly images: icl.Image[];
  private readonly tags: tcl.Tag[];
  private readonly flavor: fcl.Flavor;
  private readonly date: Date;

  public readonly logger: typeof L = {} as typeof L;

  constructor(inputs: Inputs, context: Context, repo: RepoMetadata, _logger: typeof L) {
    this.logger = _logger;
    this.inputs = inputs;
    this.context = context;
    this.repo = repo;
    this.images = icl.Transform(inputs.images, _logger);
    this.tags = tcl.Transform(inputs.tags, _logger);
    this.flavor = fcl.Transform(inputs.flavor, _logger);
    this.date = new Date();
    this.version = this.getVersion();
  }

  private getVersion(): Version {
    let version: Version = {
      main: undefined,
      partial: [],
      latest: undefined,
    };

    for (const tag of this.tags) {
      const enabled = this.setGlobalExp(tag.attrs['enable']);
      if (!['true', 'false'].includes(enabled)) {
        throw new Error(`Invalid value for enable attribute: ${enabled}`);
      }
      if (!/true/i.test(enabled)) {
        continue;
      }
      switch (tag.type) {
        case tcl.Type.Schedule: {
          version = this.procSchedule(version, tag);
          break;
        }
        case tcl.Type.Semver: {
          version = this.procSemver(version, tag);
          break;
        }
        case tcl.Type.Pep440: {
          version = this.procPep440(version, tag);
          break;
        }
        case tcl.Type.Match: {
          version = this.procMatch(version, tag);
          break;
        }
        case tcl.Type.Ref: {
          if (tag.attrs['event'] == tcl.RefEvent.Branch) {
            version = this.procRefBranch(version, tag);
          } else if (tag.attrs['event'] == tcl.RefEvent.Tag) {
            version = this.procRefTag(version, tag);
          } else if (tag.attrs['event'] == tcl.RefEvent.PR) {
            version = this.procRefPr(version, tag);
          }
          break;
        }
        case tcl.Type.Edge: {
          version = this.procEdge(version, tag);
          break;
        }
        case tcl.Type.Raw: {
          version = this.procRaw(version, tag);
          break;
        }
        case tcl.Type.Sha: {
          version = this.procSha(version, tag);
          break;
        }
      }
    }

    version.partial = version.partial.filter((item, index) => version.partial.indexOf(item) === index);
    if (version.latest == undefined) {
      version.latest = false;
    }

    return version;
  }

  private procSchedule(version: Version, tag: tcl.Tag): Version {
    if (!/schedule/.test(this.context.eventName)) {
      return version;
    }

    const currentDate = this.date;
    const vraw = this.setValue(
      handlebars.compile(tag.attrs['pattern'])({
        date: function (format: string, options: any) {
          const m = moment(currentDate);
          let tz = 'UTC';
          Object.keys(options.hash).forEach((key) => {
            switch (key) {
              case 'tz':
                tz = options.hash[key];
                break;
              default:
                throw new Error(`Unknown ${key} attribute`);
            }
          });
          return m.tz(tz).format(format);
        },
      }),
      tag,
    );

    return Meta.setVersion(version, vraw, this.flavor.latest == 'auto' ? false : this.flavor.latest == 'true');
  }

  private procSemver(version: Version, tag: tcl.Tag): Version {
    if (!/^refs\/tags\//.test(this.context.ref) && tag.attrs['value'].length == 0) {
      return version;
    }

    let vraw: string;
    if (tag.attrs['value'].length > 0) {
      vraw = this.setGlobalExp(tag.attrs['value']);
    } else {
      vraw = this.context.ref.replace(/^refs\/tags\//g, '').replace(/\//g, '-');
    }
    if (!semver.valid(vraw)) {
      this.logger.warn(`${vraw} is not a valid semver. More info: https://semver.org/`);
      return version;
    }

    let latest = false;
    const sver = semver.parse(vraw, {
      loose: true,
    });
    if (semver.prerelease(vraw)) {
      if (Meta.isRawStatement(tag.attrs['pattern'])) {
        vraw = this.setValue(handlebars.compile(tag.attrs['pattern'])(sver), tag);
      } else {
        vraw = this.setValue(handlebars.compile('{{version}}')(sver), tag);
      }
    } else {
      vraw = this.setValue(handlebars.compile(tag.attrs['pattern'])(sver), tag);
      latest = true;
    }

    return Meta.setVersion(version, vraw, this.flavor.latest == 'auto' ? latest : this.flavor.latest == 'true');
  }

  private procPep440(version: Version, tag: tcl.Tag): Version {
    if (!/^refs\/tags\//.test(this.context.ref) && tag.attrs['value'].length == 0) {
      return version;
    }

    let vraw: string;
    if (tag.attrs['value'].length > 0) {
      vraw = this.setGlobalExp(tag.attrs['value']);
    } else {
      vraw = this.context.ref.replace(/^refs\/tags\//g, '').replace(/\//g, '-');
    }
    if (!pep440.valid(vraw)) {
      this.logger.warn(`${vraw} does not conform to PEP 440. More info: https://www.python.org/dev/peps/pep-0440`);
      return version;
    }

    let latest = false;
    const pver = pep440.explain(vraw);
    if (pver?.is_prerelease || pver?.is_postrelease || pver?.is_devrelease) {
      if (Meta.isRawStatement(tag.attrs['pattern'])) {
        vraw = this.setValue(vraw, tag);
      } else {
        vraw = this.setValue(pep440.clean(vraw) as string, tag);
      }
    } else {
      vraw = this.setValue(
        handlebars.compile(tag.attrs['pattern'])({
          raw: function () {
            return vraw;
          },
          version: function () {
            return pep440.clean(vraw);
          },
          major: function () {
            return pep440.major(vraw);
          },
          minor: function () {
            return pep440.minor(vraw);
          },
          patch: function () {
            return pep440.patch(vraw);
          },
        }),
        tag,
      );
      latest = true;
    }

    return Meta.setVersion(version, vraw, this.flavor.latest == 'auto' ? latest : this.flavor.latest == 'true');
  }

  private procMatch(version: Version, tag: tcl.Tag): Version {
    if (!/^refs\/tags\//.test(this.context.ref) && tag.attrs['value'].length == 0) {
      return version;
    }

    let vraw: string;
    if (tag.attrs['value'].length > 0) {
      vraw = this.setGlobalExp(tag.attrs['value']);
    } else {
      vraw = this.context.ref.replace(/^refs\/tags\//g, '');
    }

    let tmatch;
    const isRegEx = tag.attrs['pattern'].match(/^\/(.+)\/(.*)$/);
    if (isRegEx) {
      tmatch = vraw.match(new RegExp(isRegEx[1], isRegEx[2]));
    } else {
      tmatch = vraw.match(tag.attrs['pattern']);
    }
    if (!tmatch) {
      this.logger.warn(`${tag.attrs['pattern']} does not match ${vraw}.`);
      return version;
    }
    if (typeof tmatch[tag.attrs['group'] as any] === 'undefined') {
      this.logger.warn(`Group ${tag.attrs['group']} does not exist for ${tag.attrs['pattern']} pattern.`);
      return version;
    }

    vraw = this.setValue(tmatch[tag.attrs['group'] as any], tag);
    return Meta.setVersion(version, vraw, this.flavor.latest == 'auto' ? true : this.flavor.latest == 'true');
  }

  private procRefBranch(version: Version, tag: tcl.Tag): Version {
    if (!/^refs\/heads\//.test(this.context.ref)) {
      return version;
    }
    const vraw = this.setValue(this.context.ref.replace(/^refs\/heads\//g, ''), tag);
    return Meta.setVersion(version, vraw, this.flavor.latest == 'auto' ? false : this.flavor.latest == 'true');
  }

  private procRefTag(version: Version, tag: tcl.Tag): Version {
    if (!/^refs\/tags\//.test(this.context.ref)) {
      return version;
    }
    const vraw = this.setValue(this.context.ref.replace(/^refs\/tags\//g, ''), tag);
    return Meta.setVersion(version, vraw, this.flavor.latest == 'auto' ? true : this.flavor.latest == 'true');
  }

  private procRefPr(version: Version, tag: tcl.Tag): Version {
    if (!/^refs\/pull\//.test(this.context.ref)) {
      return version;
    }

    const vraw = this.setValue(this.context.ref.replace(/^refs\/pull\//g, '').replace(/\/merge$/g, ''), tag);
    return Meta.setVersion(version, vraw, this.flavor.latest == 'auto' ? false : this.flavor.latest == 'true');
  }

  private procEdge(version: Version, tag: tcl.Tag): Version {
    if (!/^refs\/heads\//.test(this.context.ref)) {
      return version;
    }

    const val = this.context.ref.replace(/^refs\/heads\//g, '');
    if (tag.attrs['branch'].length == 0) {
      tag.attrs['branch'] = this.repo.default_branch;
    }
    if (tag.attrs['branch'] != val) {
      return version;
    }

    const vraw = this.setValue('edge', tag);
    return Meta.setVersion(version, vraw, this.flavor.latest == 'auto' ? false : this.flavor.latest == 'true');
  }

  private procRaw(version: Version, tag: tcl.Tag): Version {
    const vraw = this.setValue(this.setGlobalExp(tag.attrs['value']), tag);
    return Meta.setVersion(version, vraw, this.flavor.latest == 'auto' ? false : this.flavor.latest == 'true');
  }

  private procSha(version: Version, tag: tcl.Tag): Version {
    if (!this.context.sha) {
      return version;
    }

    let val = this.context.sha;
    if (tag.attrs['format'] === tcl.ShaFormat.Short) {
      val = this.context.sha.substring(0, parseInt(process.env['NX_CONTAINER_SHORT_SHA_LENGTH'] || '7', 10));
    }

    const vraw = this.setValue(val, tag);
    return Meta.setVersion(version, vraw, this.flavor.latest == 'auto' ? false : this.flavor.latest == 'true');
  }

  private static setVersion(version: Version, val: string, latest: boolean): Version {
    if (val.length == 0) {
      return version;
    }
    val = Meta.sanitizeTag(val);
    if (version.main == undefined) {
      version.main = val;
    } else if (val !== version.main) {
      version.partial.push(val);
    }
    if (version.latest == undefined) {
      version.latest = latest;
    }
    return version;
  }

  public static isRawStatement(pattern: string): boolean {
    try {
      const hp = handlebars.parseWithoutProcessing(pattern);
      if (hp.body.length == 1 && hp.body[0].type == 'MustacheStatement') {
        const stm: any = hp.body[0];
        return stm['path']['parts'].length == 1 && stm['path']['parts'][0] == 'raw';
      }
    } catch {
      return false;
    }
    return false;
  }

  private setValue(val: string, tag: tcl.Tag): string {
    if (Object.prototype.hasOwnProperty.call(tag.attrs, 'prefix')) {
      val = `${this.setGlobalExp(tag.attrs['prefix'])}${val}`;
    } else if (this.flavor.prefix.length > 0) {
      val = `${this.setGlobalExp(this.flavor.prefix)}${val}`;
    }
    if (Object.prototype.hasOwnProperty.call(tag.attrs, 'suffix')) {
      val = `${val}${this.setGlobalExp(tag.attrs['suffix'])}`;
    } else if (this.flavor.suffix.length > 0) {
      val = `${val}${this.setGlobalExp(this.flavor.suffix)}`;
    }
    return val;
  }

  private setGlobalExp(val: string): string {
    const context = this.context;
    const currentDate = this.date;
    return handlebars.compile(val)({
      branch: function () {
        if (!/^refs\/heads\//.test(context.ref)) {
          return '';
        }
        return context.ref.replace(/^refs\/heads\//g, '');
      },
      tag: function () {
        if (!/^refs\/tags\//.test(context.ref)) {
          return '';
        }
        return context.ref.replace(/^refs\/tags\//g, '');
      },
      sha: function () {
        return context.sha.substring(0, parseInt(process.env['NX_CONTAINER_SHORT_SHA_LENGTH'] || '7', 10));
      },
      base_ref: function () {
        if (/^refs\/tags\//.test(context.ref) && context.payload?.base_ref != undefined) {
          return context.payload.base_ref.replace(/^refs\/heads\//g, '');
        }
        // FIXME: keep this for backward compatibility even if doesn't always seem
        //  to return the expected branch. See the comment below.
        if (/^refs\/pull\//.test(context.ref) && context.payload?.pull_request?.base?.ref != undefined) {
          return context.payload.pull_request.base.ref;
        }
        return '';
      },
      is_default_branch: function () {
        const branch = context.ref.replace(/^refs\/heads\//g, '');
        // TODO: "base_ref" is available in the push payload but doesn't always seem to
        //  return the expected branch when the push tag event occurs. It's also not
        //  documented in GitHub docs: https://docs.github.com/en/developers/webhooks-and-events/webhooks/webhook-events-and-payloads#push
        //  more context: https://github.com/docker/metadata-action/pull/192#discussion_r854673012
        // if (/^refs\/tags\//.test(context.ref) && context.payload?.base_ref != undefined) {
        //   branch = context.payload.base_ref.replace(/^refs\/heads\//g, '');
        // }
        if (branch == undefined || branch.length == 0) {
          return 'false';
        }
        if (context.payload?.repository?.default_branch == branch) {
          return 'true';
        }
        // following events always trigger for last commit on default branch
        // https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows
        if (
          /create/.test(context.eventName) ||
          /discussion/.test(context.eventName) ||
          /issues/.test(context.eventName) ||
          /schedule/.test(context.eventName)
        ) {
          return 'true';
        }
        return 'false';
      },
      date: function (format: string, options: any) {
        const m = moment(currentDate);
        let tz = 'UTC';
        Object.keys(options.hash).forEach((key) => {
          switch (key) {
            case 'tz':
              tz = options.hash[key];
              break;
            default:
              throw new Error(`Unknown ${key} attribute`);
          }
        });
        return m.tz(tz).format(format);
      },
    });
  }

  private getImageNames(): Array<string> {
    const images: Array<string> = [];
    for (const image of this.images) {
      if (!image.enable) {
        continue;
      }
      images.push(Meta.sanitizeImageName(image.name));
    }
    return images;
  }

  public getTags(): Array<string> {
    if (!this.version.main) {
      return [];
    }

    const generateTags = (imageName: string, version: string): Array<string> => {
      const tags: Array<string> = [];
      const prefix = imageName !== '' ? `${imageName}:` : '';
      tags.push(`${prefix}${version}`);
      for (const partial of this.version.partial) {
        tags.push(`${prefix}${partial}`);
      }
      if (this.version.latest) {
        const latestTag = `${this.flavor.prefixLatest ? this.flavor.prefix : ''}latest${
          this.flavor.suffixLatest ? this.flavor.suffix : ''
        }`;
        tags.push(`${prefix}${Meta.sanitizeTag(latestTag)}`);
      }
      return tags;
    };

    const tags: Array<string> = [];
    const images = this.getImageNames();
    if (images.length > 0) {
      for (const imageName of images) {
        tags.push(...generateTags(imageName, this.version.main));
      }
    } else {
      tags.push(...generateTags('', this.version.main));
    }
    return tags;
  }

  public getLabels(): Array<string> {
    return this.getOCIAnnotationsWithCustoms(this.inputs.labels);
  }

  public getAnnotations(): Array<string> {
    return this.getOCIAnnotationsWithCustoms(this.inputs.annotations);
  }

  private getOCIAnnotationsWithCustoms(extra: string[]): Array<string> {
    const res: Array<string> = [
      `org.opencontainers.image.title=${this.repo.name || ''}`,
      `org.opencontainers.image.description=${this.repo.description || ''}`,
      `org.opencontainers.image.url=${this.repo.html_url || ''}`,
      `org.opencontainers.image.source=${this.repo.html_url || ''}`,
      `org.opencontainers.image.version=${this.version.main || ''}`,
      `org.opencontainers.image.created=${this.date.toISOString()}`,
      `org.opencontainers.image.revision=${this.context.sha || ''}`,
      `org.opencontainers.image.licenses=${this.repo.license?.spdx_id || ''}`,
    ];
    res.push(...extra);

    return Array.from(
      new Map<string, string>(
        res
          .map((label) => label.split('='))

          .filter(([_key, ...values]) => values.length > 0)
          .map(([key, ...values]) => [key, values.join('=')] as [string, string]),
      ),
    )
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([key, value]) => `${key}=${value}`);
  }

  public getJSON(alevels: string[]): unknown {
    const annotations: Array<string> = [];
    for (const level of alevels) {
      annotations.push(...this.getAnnotations().map((label) => `${level}:${label}`));
    }
    return {
      tags: this.getTags(),
      labels: this.getLabels().reduce((res: Record<string, string>, label: string) => {
        const matches = label.match(/([^=]*)=(.*)/);
        if (!matches) {
          return res;
        }
        res[matches[1]] = matches[2];
        return res;
      }, {}),
      annotations: annotations,
    };
  }

  public getBakeFile(kind: string): string {
    if (kind == 'tags') {
      return this.generateBakeFile(
        {
          tags: this.getTags(),
          args: {
            DOCKER_META_IMAGES: this.getImageNames().join(','),
            DOCKER_META_VERSION: this.version.main,
          },
        },
        kind,
      );
    } else if (kind == 'labels') {
      return this.generateBakeFile(
        {
          labels: this.getLabels().reduce((res: Record<string, string>, label: string) => {
            const matches = label.match(/([^=]*)=(.*)/);
            if (!matches) {
              return res;
            }
            res[matches[1]] = matches[2];
            return res;
          }, {}),
        },
        kind,
      );
    } else if (kind.startsWith('annotations:')) {
      const name = kind.split(':')[0];
      const annotations: Array<string> = [];
      for (const level of kind.split(':')[1].split(',')) {
        annotations.push(...this.getAnnotations().map((label) => `${level}:${label}`));
      }
      return this.generateBakeFile(
        {
          annotations: annotations,
        },
        name,
      );
    }
    throw new Error(`Unknown bake file type: ${kind}`);
  }

  public getBakeFileTagsLabels(): string {
    return this.generateBakeFile({
      tags: this.getTags(),
      labels: this.getLabels().reduce((res: Record<string, string>, label: string) => {
        const matches = label.match(/([^=]*)=(.*)/);
        if (!matches) {
          return res;
        }
        res[matches[1]] = matches[2];
        return res;
      }, {}),
      args: {
        DOCKER_META_IMAGES: this.getImageNames().join(','),
        DOCKER_META_VERSION: this.version.main,
      },
    });
  }

  private generateBakeFile(dt: Record<string, any>, suffix?: string): string {
    const bakeFile = path.join(tmpDir(), `container-metadata-action-bake${suffix ? `-${suffix}` : ''}.json`);
    fs.writeFileSync(bakeFile, JSON.stringify({ target: { [this.inputs['bake-target']]: dt } }, null, 2));
    return bakeFile;
  }

  private static sanitizeImageName(name: string): string {
    return interpolate(name).toLowerCase();
  }

  private static sanitizeTag(tag: string): string {
    return tag.replace(/[^a-zA-Z0-9._-]+/g, '-');
  }
}
