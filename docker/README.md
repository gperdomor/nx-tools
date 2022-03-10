# Nx Docker Builder

This repository provides a docker image to use with [@nx-tools/nx-docker](https://github.com/gperdomor/nx-tools/tree/master/packages/nx-docker) package

## Version Matrix

### Node 12

|    Image Tag    |  Node Version   | Docker Engine | Buildx |
| :-------------: | :-------------: | :-----------: | :----: |
| 12.21.0-alpine  | 12.21.0-alpine  |    20.10.6    | 0.5.1  |
| 12.22.0-alpine  | 12.22.0-alpine  |    20.10.6    | 0.5.1  |
| 12.22.1-alpine  | 12.22.1-alpine  |    20.10.6    | 0.5.1  |
| 12.22.2-alpine  | 12.22.2-alpine  |    20.10.7    | 0.5.1  |
| 12.22.3-alpine  | 12.22.3-alpine  |    20.10.7    | 0.6.0  |
| 12.22.4-alpine  | 12.22.4-alpine  |    20.10.8    | 0.6.1  |
| 12.22.5-alpine  | 12.22.5-alpine  |    20.10.8    | 0.6.1  |
| 12.22.6-alpine  | 12.22.6-alpine  |    20.10.8    | 0.6.3  |
| 12.22.7-alpine  | 12.22.7-alpine  |    20.10.8    | 0.6.3  |
| 12.22.8-alpine  | 12.22.8-alpine  |   20.10.12    | 0.7.1  |
| 12.22.9-alpine  | 12.22.9-alpine  |   20.10.12    | 0.7.1  |
| 12.22.10-alpine | 12.22.10-alpine |   20.10.12    | 0.8.0  |

> The images are also taged with their corresponding 12-alpine and 12.22-alpine format.
>
> \* Helm support... Helm support is added in special image tag with `-helm` suffix, like 12-alpine-helm, 12.22-alpine-helm or 12.22.1-alpine-helm

### Node 14

|   Image Tag    |  Node Version  | Docker Engine | Buildx |
| :------------: | :------------: | :-----------: | :----: |
| 14.15.5-alpine | 14.15.5-alpine |    20.10.6    | 0.5.1  |
| 14.16.0-alpine | 14.16.0-alpine |    20.10.6    | 0.5.1  |
| 14.16.1-alpine | 14.16.1-alpine |    20.10.6    | 0.5.1  |
| 14.17.0-alpine | 14.17.0-alpine |    20.10.6    | 0.5.1  |
| 14.17.1-alpine | 14.17.1-alpine |    20.10.7    | 0.5.1  |
| 14.17.2-alpine | 14.17.2-alpine |    20.10.7    | 0.5.1  |
| 14.17.3-alpine | 14.17.3-alpine |    20.10.7    | 0.6.0  |
| 14.17.4-alpine | 14.17.4-alpine |    20.10.8    | 0.6.1  |
| 14.17.5-alpine | 14.17.5-alpine |    20.10.8    | 0.6.1  |
| 14.17.6-alpine | 14.17.6-alpine |    20.10.8    | 0.6.3  |
| 14.18.0-alpine | 14.18.0-alpine |    20.10.8    | 0.6.3  |
| 14.18.1-alpine | 14.18.1-alpine |    20.10.8    | 0.6.3  |
| 14.18.2-alpine | 14.18.2-alpine |   20.10.11    | 0.7.1  |
| 14.18.3-alpine | 14.18.3-alpine |   20.10.12    | 0.7.1  |
| 14.19.0-alpine | 14.19.0-alpine |   20.10.12    | 0.8.0  |

> The images are also taged with their corresponding 14-alpine and 14.16-alpine format.

### Node 15

|   Image Tag    |  Node Version  | Docker Engine | Buildx |
| :------------: | :------------: | :-----------: | :----: |
| 15.13.0-alpine | 15.13.0-alpine |    20.10.6    | 0.5.1  |
| 15.14.0-alpine | 15.14.0-alpine |    20.10.6    | 0.5.1  |

> The images are also taged with their corresponding 15-alpine and 15.14-alpine format.

### Node 16

|   Image Tag    |  Node Version  | Docker Engine | Buildx |
| :------------: | :------------: | :-----------: | ------ |
| 16.0.0-alpine  | 16.0.0-alpine  |    20.10.6    | 0.5.1  |
| 16.1.0-alpine  | 16.1.0-alpine  |    20.10.6    | 0.5.1  |
| 16.2.0-alpine  | 16.2.0-alpine  |    20.10.6    | 0.5.1  |
| 16.3.0-alpine  | 16.3.0-alpine  |    20.10.7    | 0.5.1  |
| 16.4.0-alpine  | 16.4.0-alpine  |    20.10.7    | 0.5.1  |
| 16.4.1-alpine  | 16.4.1-alpine  |    20.10.7    | 0.5.1  |
| 16.4.2-alpine  | 16.4.2-alpine  |    20.10.7    | 0.5.1  |
| 16.5.0-alpine  | 16.5.0-alpine  |    20.10.7    | 0.6.0  |
| 16.6.0-alpine  | 16.6.0-alpine  |    20.10.8    | 0.6.1  |
| 16.6.1-alpine  | 16.6.1-alpine  |    20.10.8    | 0.6.1  |
| 16.6.2-alpine  | 16.6.2-alpine  |    20.10.8    | 0.6.1  |
| 16.8.0-alpine  | 16.8.0-alpine  |    20.10.8    | 0.6.3  |
| 16.9.0-alpine  | 16.9.0-alpine  |    20.10.8    | 0.6.3  |
| 16.10.0-alpine | 16.10.0-alpine |    20.10.8    | 0.6.3  |
| 16.11.1-alpine | 16.11.1-alpine |    20.10.8    | 0.6.3  |
| 16.12.0-alpine | 16.12.0-alpine |    20.10.8    | 0.6.3  |
| 16.13.0-alpine | 16.13.0-alpine |    20.10.8    | 0.6.3  |
| 16.13.1-alpine | 16.13.1-alpine |   20.10.11    | 0.7.1  |
| 16.13.2-alpine | 16.13.2-alpine |   20.10.12    | 0.7.1  |
| 16.14.0-alpine | 16.14.0-alpine |   20.10.12    | 0.8.0  |

> The images are also taged with their corresponding 16-alpine and 16.0-alpine format.

### Node 17

|   Image Tag   | Node Version  | Docker Engine | Buildx |
| :-----------: | :-----------: | :-----------: | ------ |
| 17.0.0-alpine | 17.0.0-alpine |   20.10.12    | 0.7.1  |
| 17.3.0-alpine | 17.3.0-alpine |   20.10.12    | 0.7.1  |
| 17.6.0-alpine | 17.6.0-alpine |   20.10.12    | 0.8.0  |

> The images are also taged with their corresponding 17-alpine and 17.0-alpine format.
