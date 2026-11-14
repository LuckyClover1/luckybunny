# luckybunny

儿童绘本 / 童话故事视频站，移动端优先，部署在 GitHub Pages。

- 线上地址：https://luckyclover1.github.io/luckybunny/
- 首页为分类列表，点击专辑进入播放页

## 目录结构

```
docs/
├── index.html            分类首页
├── cate.html             专辑播放页（cate.html?id=分类ID）
├── js/httpclient.js      轻量 XHR 封装
├── json/cate.json        分类与专辑配置
└── json/media-{id}.json  专辑内的故事列表
```

## 数据格式

`json/cate.json`：分类名 → 专辑数组

```json
{
  "绘本故事": [
    { "name": "贝乐虎绘本故事", "icon": "https://.../cover.jpg", "id": 82 }
  ]
}
```

`json/media-{id}.json`：故事数组

```json
[
  { "icon": "https://.../thumb.jpg", "id": 5971, "name": "马鲁的生日", "videoUrl": "https://.../1.mp4" }
]
```

新增专辑不需要改代码：在 `cate.json` 里加一条，再在 `json/` 下新建对应的 `media-{id}.json` 即可。

## 注意

页面通过 https 访问，`icon` 与 `videoUrl` 请使用 **https** 地址；http 资源会被浏览器按混合内容拦截。
