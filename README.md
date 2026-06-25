# 周报助手（Week Report Writer）

一个基于 **Vue 3 + Java + TeaVM** 的周报撰写小网站，可部署在 GitHub Pages 上。

## 核心功能

- 输入每周工作内容，自动拆解生成结构化周报
- 多种模板可选：标准周报、STAR 法、极简版、管理者视角，支持自定义模板
- 一键复制全文，导出 `.txt` / `.md` / `.html`
- 历史记录保存（IndexedDB），支持搜索和重新加载
- 周报质量评分、关键词云、数据看板
- 中英双语切换、深色/浅色主题
- 高级视觉动效（粒子背景、页面动画、卡片悬浮）

## 技术栈

- **前端**：Vue 3 + Vite + TypeScript + Element Plus + Pinia + Vue I18n
- **Java 运行方式**：TeaVM 将 Java 核心逻辑编译为 JavaScript，在浏览器中运行
- **数据存储**：IndexedDB（Dexie.js）
- **图表**：ECharts + echarts-wordcloud
- **部署**：GitHub Actions → GitHub Pages

## 本地开发

### 环境要求

- Node.js 20+
- Java 17+
- Maven 3.9+

### 安装依赖

```bash
npm install
```

### 编译 Java 核心

```bash
cd java-core
mvn clean package -DskipTests
cp target/javascript/classes.js ../public/week-report-core.js
cd ..
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

## 部署到 GitHub Pages

1. 将代码推送到 GitHub 仓库的 `main` 分支
2. 在仓库 Settings → Pages 中，Source 选择 "GitHub Actions"
3. GitHub Actions 会自动构建并部署
4. 如需绑定自定义域名，在仓库 Settings → Pages 中配置，并在 `public/CNAME` 文件中写入域名

## 项目结构

```
.
├── java-core/                  # Java 业务逻辑（TeaVM 编译）
│   ├── pom.xml
│   └── src/main/java/com/weekreport/
│       ├── core/               # 报告引擎、模板解析、质量评分
│       ├── parser/             # 文本解析、关键词提取
│       ├── wasm/               # JSO 导出入口
│       └── model/              # 数据模型
├── public/                     # 静态资源
│   └── week-report-core.js     # TeaVM 编译产物
├── src/
│   ├── components/             # Vue 组件
│   ├── composables/            # 组合式函数
│   ├── stores/                 # Pinia 状态管理
│   ├── i18n/                   # 中英语言包
│   ├── router/                 # 路由配置
│   ├── types/                  # TypeScript 类型
│   ├── views/                  # 页面视图
│   ├── App.vue
│   └── main.ts
├── .github/workflows/deploy.yml # GitHub Actions 部署配置
├── index.html
├── package.json
├── vite.config.ts
└── README.md
```

## 自定义模板格式

自定义模板包含以下字段：

- `name` / `nameZh`：模板名称（英文/中文）
- `description` / `descriptionZh`：模板描述
- `sections`：段落数组，每个段落包含：
  - `key`：标识符
  - `title` / `titleZh`：段落标题
  - `prompt` / `promptZh`：拆解提示
  - `required`：是否必填
  - `order`：排序

## 许可证

MIT
