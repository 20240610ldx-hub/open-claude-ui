# Claude Desktop 2.0 (v2.37337.1) 全量版本更新深度逆向分析与 CDS 2.0 架构演进报告

> **目标应用载体**：Anthropic 官方生产包 macOS `/Applications/Claude.app`  
> **二进制元数据**：`@ant/desktop v2.37337.1`（Build: `2026-10-13T22:16:06Z`，开发者签名：`Developer ID Application: Anthropic PBC (Q6L2SF6YDW)`）  
> **逆向工具栈**：**[REA (Reverse Engineer Anything) v6.5.0](https://github.com/morluto/rea)** 全流程执行 Fuse 熔丝扫描、Mach-O 代码签名提取、AST 抽象语法树解构与 Electron ASAR 运行时逆向审计。

---

## 📊 版本演进全景对比矩阵 (1.x 对话外壳 vs. 2.0 执行工作站)

本对比矩阵汇总自 REA 逆向工程实验室对 Anthropic 官方生产包 `@ant/desktop v2.37337.1` 全量 AST 抽象语法树与运行时解构事实。系统全面从「轻量对话外壳」升格为「企业级多沙箱执行工作站」：

### 1. ✨ 2.0 纯新增特性矩阵 (New Additions)

| 核心模块 / 特性 | 1.x 原版机制 (1.x Baseline) | 2.0 升级演进 (2.0 Workstation) | 变革类型 | 核心算法与底层工程价值 |
| :--- | :--- | :--- | :---: | :--- |
| **触控负边距补偿** | 无独立工具下颌，Composer 采用单一整体卡片容器 | 新增 `ChatComposerChin` 28px 极窄下颌行，通过 `--cmp-chin-touch-grow: 4px` 动态外扩触控热区至 44px | **纯新增** | `margin-block: calc(...) * -1`：兼顾视觉极致紧凑与 WCAG 2.1 AA 移动触控防误触标准 |
| **推理算力调节器** | 单一二元开关（Extended Thinking 开 / 关） | 演进出 `Low` / `Medium` / `High` / `Extra` / `Max` 5 阶细分档位，内建企业托管锁定策略 | **纯新增** | `ModelSelectorEffort` 精细化管理 Token 燃烧速度，Max 档显式弹出熔断警示，防止单次消耗失控 |
| **离线消息事务暂存** | 网络中断直接抛出红色失败报错，一旦刷新或关闭页面，已输入的整篇 Prompt 彻底丢失 | 引入 `ChatComposerQueuedMessages`，断网自动捕获并与客户端 IndexedDB 本地事务双写绑定 | **纯新增** | 零丢失保障协议：呼出琥珀色重发横幅，支持断线重连一键重放，即使杀掉进程重启依然完好 |
| **纯 CSS `sibling-index()`** | 依赖 JS 遍历数组并用 inline style 注入 `animationDelay: ${idx * 30}ms` | 纯 CSS 原生选择器函数计算 `calc(50ms + min(sibling-index() - 1, 8) * 30ms)` | **纯新增** | 剥离 JS 主线程计算，由浏览器样式层直接原生计算延迟，彻底消除数组重排抖动 |
| **Scroll-Driven 滚动驱动遮罩** | 顶部固定透明度渐变蒙层，触顶时依然死板遮挡第一行文字 | 绑定原生 CSS 滚动时间轴（Scroll-Timeline），触顶遮罩动态衰减为 `0px`，滚离顶部自适应展开为 `24px` 羽化 | **纯新增** | `@keyframes cds-scroll-fade-top`：无需任何滚动监听器（Scroll Listener），零主线程 CPU 消耗 |
| **离线随包内联可视化引擎** | 依赖公网 CDN 动态拉取在线渲染脚本 | 随 ASAR 捆绑内联 Mermaid 11.17.2 / Chart.js 4.5.0 / Grid.js 5.0.2，并定义数据表格 `[data-dimmed]` 失活行规范 | **纯新增** | 满足金融、军工及涉密内网机房 100% 离线合规可用，彻底杜绝外链加载安全隐患 |
| **独立多窗口架构 (Window Pop-out)** | 单一主窗口，多任务并行只能在左侧边栏反复切换 | Electron IPC 管道 `DESKTOP_WINDOW_POP_OUT_CHAT` 剥离独立 BrowserWindow，带独立的 Find-in-Page 搜索 | **纯新增** | 多沙箱隔离：子窗口享有独立渲染进程堆内存与 `claude://session/${id}?mode=popout` 上下文 |

### 2. 🔄 2.0 核心架构重构矩阵 (Refactoring & Evolution)

| 核心模块 / 维度 | 1.x 原版设计 (1.x Design) | 2.0 升级架构 (2.0 Architecture) | 变革类型 | 核心重构机理与收益 |
| :--- | :--- | :--- | :---: | :--- |
| **输入终端几何圆角** | 20px 巨圆角胶囊 (`--cds-radius-composer: 20px`)，四周存在大量无法利用的死角 | 12px 扁平工业圆角 (`--radius-xl: 12px`)，平底下颌工具栏 | **视觉/空间重构** | 告别闲聊玩具感，四个边角释放出大量空间容纳状态指示器、代码语言标签与操作按钮 |
| **会话侧边栏与环境收敛** | 36px 宽松会话卡片，纯时间维度倒序罗列，无环境归属 | 28px 高密状态行 (`data-density="compact"`)，四态物理源收敛（本地/云端/沙箱/协同），内嵌 Git 与 PR 胶囊 | **信息架构重构** | 引入章节图钉（Pin as chapter），将聊天记录升格为带分支追踪代码工作区 |
| **动效下沉 Compositor 线程** | 使用 JS Framer Motion / requestAnimationFrame 进行主线程逐帧求值 | 建立 47 项 `@keyframes cds-*` 纯 CSS 合成器动效，完全由 GPU 线程独立渲染 | **性能架构重构** | 彻底消除 AI 在 100+ tokens/s 狂飙流式吐字时与 JS 动画争抢 CPU 导致的发热与掉帧瓶颈 |
| **胶囊与小药丸物理形变** | 简单的线性或单阶缓动放大缩小 | 两段式物理谐振回弹，`cubic-bezier(0.34, 1.32, 0.64, 1)`，0~100ms 猛冲至 1.32x 形变，100~240ms 弹性收敛 | **交互物理重构** | 增加 +32% 超调量（Overshoot），提供极其紧致且有韧性的机械果冻手感 |
| **骨架屏占位扫光质感** | 传统垂直 90° 灰色条纹平移扫光（复印机式光斑） | 105° 倾斜非线性双模扫光（Wave 流体波浪模式 vs Lockstep 步进对齐模式） | **微质感重构** | 模拟斜射玻璃高光与金属拉丝质感，非线性光影在视觉心理学上显著缩短等待焦虑 |
| **视觉底色与发丝级边框** | 偏暖的陶土米黄纸张底色，硬编码静态 RGBA 阴影 | 跃迁为冷雪花白 (`#FCFCFB`) 与深墨黑 (`#151515`)，采用 `color-mix()` 相对色彩与 0.5px 发丝边 | **色彩/空间重构** | 严格贯彻「单边框法则 (1-Border Rule)」，依靠背景色相实时动态漫反射，杜绝一切套娃描边 |
| **用量与配额实时感知** | 静态文字说明与模糊的百分比估算 | 5 小时滑动窗口 Token 配额环形刻度传感器，实时反馈刷新倒计时与防熔断安全阈值 | **状态感知重构** | 实时感知 429 临界点，防止高强度编码中途遭遇断流阻断 |
| **企业托管策略键名** | 旧键名如 `isDxtEnabled`、`enduserAttribution` 等 | 彻底移除旧键名兼容逻辑，替换为严格大驼峰 `isDesktopExtensionEnabled`、`endUserAttribution` | **破坏性重构 (Breaking)** | 规避策略静默失效导致的“未托管降级 (Unmanaged)”漏洞；升级后需重签 OAuth MCP 授权 |

---

## 🧭 第二版分章目录与导读索引

- [第一章：综述与版本边界](01-综述与版本边界.md)
  - 1.1 版本边界声明 (捆绑 CLI 2.1.295 vs 独立 CLI 2.1.299/300)
  - 1.2 全局设计契约演进 (1.x 对话外壳 vs 2.0 执行沙箱工作站、环境不可变性、零丢失承诺)
- [第二章：新增特性深度逆向](02-新增特性深度逆向.md)
  - 2.1 独立多窗口架构 (Electron IPC 弹射窗口、会话隔离与 Find-in-Page)
  - 2.2 离线可视化组件 (随包内联 Mermaid/Chart.js/Grid.js 与失活行规范)
  - 2.3 离线消息重试机制 (ChatComposerQueuedMessages 与 IndexedDB 事务持久化)
  - 2.4 推理算力调节器 (ModelSelectorEffort 5 阶档位与企业策略防线)
  - 2.5 现代 CSS 动效系统 (sibling-index() 级联、View Transitions 页面转场、Scroll-Driven 滚动驱动遮罩)
  - 2.6 首页卡片微光浮空 (3D 悬浮透视与底部高光径向渐变)
  - 2.7 极细发丝边与相对色彩 (0.5px 发丝细边与 color-mix() 动态漫反射)
  - 2.8 触控负边距补偿 (--cmp-chin-touch-grow 尺寸补偿算法)
  - 2.9 企业托管配置迁移 (6 大破坏性键名映射、未托管降级风险、OAuth 重新认证)
- [第三章：架构重构与对比分析](03-架构重构与对比分析.md)
  - 3.1 会话侧边栏与环境收敛 (28px 高密状态列、四态物理源分组收敛、Git 分支与 PR 胶囊、Halo 心跳)
  - 3.2 工作台画布与底色演进 (暖陶土信纸跃迁为冷雪花白 #FCFCFB、暗部墨黑 #151515 对比分析)
  - 3.3 基础圆角与密度系统 (Composer 圆角 20px 降为 12px/14px、Density 紧凑/舒适双模引擎)
  - 3.4 模型选择器与用量感知 (选模用量仪表化、5 小时配额感知、Context 移入新建会话抽屉)
  - 3.5 骨架屏与胶囊微交互 (Pill 1.32x 过冲回弹两段式形变、Skeleton 双模 Wave/Lockstep + 105° 扫光)
  - 3.6 运行时并发与环境隔离 (十大关键并发缺陷修复、Windows OpenSSH 路径硬锁定与证书轮换)
  - 3.7 章节图钉界面泄漏 (Pin as chapter 真实面目与内部工具取证)
  - 3.8 动效纯 CSS 合成器化 (为什么全面 Compositor 化，消解 100+ tokens/s 流式吐字掉帧瓶颈)
- [第四章：系统底座全景解密](04-系统底座全景解密.md)
  - 4.1 纯 CSS 动效参数 (47 项 @keyframes cds-* 完整清单)
  - 4.2 原生组件命名空间 (40 大 data-cds 原生组件命名空间契约)
  - 4.3 响应时间与贝塞尔曲线 (5 阶时间 Token 60ms~450ms 与 3 大精确贝塞尔控制点)
- [第五章：生产级参考实现代码](05-生产级参考实现代码.md)
  - 5.1 模型选择与算力调节器 (`ModelSelectorEffort.tsx`)
  - 5.2 输入框底部工具栏 (`ChatComposerChin.tsx`)
  - 5.3 动效引擎与微交互 (`CdsMotionEngine.tsx`)
- [第六章：总结与升格意义](06-总结与升格意义.md)
  - 6.1 结构规范化
  - 6.2 动效物理化
  - 6.3 架构安全化

> 💡 **单文件检索**：如需离线单文件全局搜索第二版全文，可直接参阅 [第二版单文件完整版](Claude-Desktop-2.0-全量分析.full.md)。
