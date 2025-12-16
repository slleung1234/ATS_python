
import { Level, CellType, CharacterConfig } from './types';

const _ = CellType.EMPTY;
const W = CellType.WALL;
const G = CellType.GOAL;
const C = CellType.COIN;
// const O = CellType.OBSTACLE;

export const CHARACTERS: CharacterConfig[] = [
    {
        id: 'pikachu',
        name: '比卡超',
        // 對應 1.png
        imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
        scale: 0.9
    },
    {
        id: 'ironman',
        name: 'IRONMAN',
        // 對應 2.png
        imageUrl: 'https://upload.wikimedia.org/wikipedia/en/4/47/Iron_Man_%28circa_2018%29.png',
        scale: 1.1
    }
];

export const LEVELS: Level[] = [
  {
    id: 1,
    title: "第一關：旺角迷途",
    description: "歡迎來到 CodeHero HK！你的角色迷失在旺角的人潮中。使用 Python 指令走到出口（綠色格子）。",
    objective: "到達綠色出口",
    pythonConcept: "基本指令 (Sequencing)",
    gridSize: 5,
    startPos: { x: 0, y: 0 },
    layout: [
      [_, _, W, _, _],
      [_, W, W, _, _],
      [_, _, _, _, _],
      [W, W, W, W, _],
      [_, _, _, _, G],
    ],
    initialCode: `# 在這裡輸入你的代碼
# 試試看 hero.move_right() 或 hero.move_down()

hero.move_right()
hero.move_right()
`,
    tutorialText: "提示：你需要連續移動才能繞過牆壁。試著在腦海中模擬路徑。",
    timeLimit: 60
  },
  {
    id: 2,
    title: "第二關：激光數據庫 (Variables)",
    description: "我們要入侵數據中心，但前面有一條長長的走廊。如果一步步走太慢了，使用「變數」來設定移動距離，快速跳過檢查點！",
    objective: "定義變數並使用它來移動",
    pythonConcept: "變數 (Variables) 與 參數",
    gridSize: 8,
    startPos: { x: 0, y: 2 },
    layout: [
      [W, W, W, W, W, W, W, W],
      [W, W, W, W, W, W, W, W],
      [_, _, _, _, _, _, _, G],
      [W, W, W, W, W, W, W, W],
      [W, W, W, W, W, W, W, W],
      [_, _, _, _, _, _, _, _], 
      [W, W, W, W, W, W, W, W],
      [W, W, W, W, W, W, W, W],
    ],
    initialCode: `# 前方距離出口有 7 格
# 我們可以定義一個變數來代表距離

steps = 7

# 然後把變數放入指令中，像這樣：
# hero.move_right(steps)

# 試試看！
`,
    tutorialText: "變數就像一個貼了標籤的盒子，裡面裝著數字。你可以隨時改變盒子裡的內容！",
    timeLimit: 60
  },
  {
    id: 3,
    title: "第三關：尋找蛋撻",
    description: "為了補充體力，你需要先收集美味的蛋撻（黃色圓點），然後前往天星碼頭（出口）。",
    objective: "收集蛋撻並到達出口",
    pythonConcept: "順序與調試",
    gridSize: 6,
    startPos: { x: 0, y: 0 },
    layout: [
      [_, _, _, _, _, _],
      [_, W, W, W, W, _],
      [_, _, C, _, W, _],
      [W, W, W, _, _, _],
      [_, _, _, _, W, _],
      [G, W, W, _, _, _],
    ],
    initialCode: `# 記得收集蛋撻 (C)！
# 蛋撻會自動收集，只要你走到那一格。

hero.move_right()
hero.move_right()
hero.move_down()
hero.move_down()
`,
    tutorialText: "小心！如果撞到牆壁 (W)，程式就會報錯停止。計算好步數！",
    timeLimit: 90
  },
  {
    id: 4,
    title: "第四關：獅子山下 (Loop)",
    description: "路途遙遠，我們需要重複的動作。使用 'for loop' 來減少重複的代碼。",
    objective: "使用迴圈到達山頂",
    pythonConcept: "迴圈 (For Loops)",
    gridSize: 8,
    startPos: { x: 0, y: 7 },
    layout: [
      [_, _, _, _, _, _, _, G],
      [_, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _],
    ],
    initialCode: `# 目標在最右上角
# 與其寫 7 次 hero.move_right()...
# 不如試試看 for loop:

for i in range(7):
    hero.move_right()

# 接下來呢？
`,
    tutorialText: "`range(n)` 會讓裡面的指令重複執行 n 次。記得縮排 (Indentation) 很重要！",
    timeLimit: 120
  }
];

// Mock Student Data
export const MOCK_STUDENT_STATS = [
    { studentId: "S001", name: "陳大文", class: "2A", levelId: 1, status: "Completed", attempts: 2, timeSpent: 45, lastPlayed: "2023-10-24 10:30" },
    { studentId: "S002", name: "李小明", class: "2A", levelId: 1, status: "Failed", attempts: 5, timeSpent: 60, lastPlayed: "2023-10-24 10:35" },
    { studentId: "S003", name: "張志強", class: "2A", levelId: 2, status: "In Progress", attempts: 1, timeSpent: 30, lastPlayed: "2023-10-24 10:40" },
    { studentId: "S004", name: "黃美麗", class: "2B", levelId: 3, status: "Completed", attempts: 1, timeSpent: 80, lastPlayed: "2023-10-24 10:20" },
    { studentId: "S005", name: "何家豪", class: "2B", levelId: 1, status: "Completed", attempts: 3, timeSpent: 55, lastPlayed: "2023-10-24 10:25" },
];
