import { useEffect, useState, useRef, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import confetti from 'canvas-confetti';
import { ArrowLeft, Terminal, Play, CheckCircle2, ChevronUp, ChevronDown, Check, X, ShieldAlert, Cpu, Eye, SkipBack, SkipForward, Pause, FastForward, Sparkles, Brain } from 'lucide-react';

interface TestCase {
  id: number;
  input: string;
  expectedOutput: string;
}

interface ProblemDetail {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  videoUrl?: string;
  timeLimitMs: number;
  memoryLimitMb: number;
  boilerplates: Record<string, string>;
  testCases: TestCase[];
}

interface CodingWorkspaceProps {
  problemId: string;
  onBack: () => void;
  currentUser: { name: string, email: string, role: string } | null;
}

// ─── Algorithm Visualizer Component ──────────────────────────────────────────

interface VizStep {
  title: string;
  description: string;
  highlights: number[];    // indices to highlight in array
  pointers: Record<string, number>; // named pointers (e.g. {left: 0, right: 5, mid: 2})
  stack?: string[];        // for stack-based visualizations
  hashMap?: Record<string, string>; // for hash map visualizations
  result?: string;         // current result state
  found?: boolean;
}

function generateSteps(problemId: string, testCases: { input: string; expectedOutput: string }[]): VizStep[] {
  const tc = testCases[0];
  if (!tc) return [{ title: 'No Data', description: 'No test cases available for visualization.', highlights: [], pointers: {} }];

  // Two Sum visualization
  if (problemId === 'two-sum' || problemId.includes('two-sum')) {
    try {
      const lines = tc.input.split('\n');
      const nums: number[] = JSON.parse(lines[0]);
      const target = parseInt(lines[1]);
      const steps: VizStep[] = [{ title: 'Initialize', description: `Find two numbers in [${nums.join(', ')}] that add up to ${target}. Initialize an empty hash map.`, highlights: [], pointers: {}, hashMap: {} }];
      const map: Record<string, string> = {};
      for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map[String(complement)] !== undefined) {
          steps.push({ title: `Found Match!`, description: `Index ${i}: value=${nums[i]}, complement=${complement} EXISTS in map at index ${map[String(complement)]}. Return [${map[String(complement)]}, ${i}].`, highlights: [parseInt(map[String(complement)]), i], pointers: { i }, hashMap: { ...map }, found: true, result: `[${map[String(complement)]}, ${i}]` });
          break;
        }
        map[String(nums[i])] = String(i);
        steps.push({ title: `Scan Index ${i}`, description: `Value=${nums[i]}, complement=${complement}. Not in map. Store {${nums[i]}: ${i}}.`, highlights: [i], pointers: { i }, hashMap: { ...map } });
      }
      return steps;
    } catch { /* fall through */ }
  }

  // Binary Search visualization
  if (problemId === 'binary-search' || problemId.includes('binary-search')) {
    try {
      const lines = tc.input.split('\n');
      const nums: number[] = JSON.parse(lines[0]);
      const target = parseInt(lines[1]);
      const steps: VizStep[] = [{ title: 'Initialize', description: `Search for ${target} in sorted array [${nums.join(', ')}]. Set left=0, right=${nums.length - 1}.`, highlights: [], pointers: { left: 0, right: nums.length - 1 } }];
      let left = 0, right = nums.length - 1;
      while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (nums[mid] === target) {
          steps.push({ title: `Found Target!`, description: `mid=${mid}, nums[${mid}]=${nums[mid]} === ${target}. Target found at index ${mid}!`, highlights: [mid], pointers: { left, right, mid }, found: true, result: String(mid) });
          break;
        } else if (nums[mid] < target) {
          steps.push({ title: `Search Right Half`, description: `mid=${mid}, nums[${mid}]=${nums[mid]} < ${target}. Move left to ${mid + 1}.`, highlights: [mid], pointers: { left, right, mid } });
          left = mid + 1;
        } else {
          steps.push({ title: `Search Left Half`, description: `mid=${mid}, nums[${mid}]=${nums[mid]} > ${target}. Move right to ${mid - 1}.`, highlights: [mid], pointers: { left, right, mid } });
          right = mid - 1;
        }
      }
      if (!steps.some(s => s.found)) {
        steps.push({ title: 'Not Found', description: `Target ${target} not found in array. Return -1.`, highlights: [], pointers: { left, right }, result: '-1' });
      }
      return steps;
    } catch { /* fall through */ }
  }

  // Valid Parentheses visualization
  if (problemId === 'valid-parentheses' || problemId.includes('parenthes')) {
    try {
      let s = tc.input.trim().replace(/^"|"$/g, '');
      const steps: VizStep[] = [{ title: 'Initialize', description: `Check if "${s}" has valid parentheses. Initialize empty stack.`, highlights: [], pointers: {}, stack: [] }];
      const stack: string[] = [];
      const matchMap: Record<string, string> = { ')': '(', ']': '[', '}': '{' };
      let valid = true;
      for (let i = 0; i < s.length; i++) {
        const ch = s[i];
        if ('([{'.includes(ch)) {
          stack.push(ch);
          steps.push({ title: `Push '${ch}'`, description: `Index ${i}: '${ch}' is opening bracket. Push onto stack.`, highlights: [i], pointers: { i }, stack: [...stack] });
        } else {
          if (stack.length === 0 || stack[stack.length - 1] !== matchMap[ch]) {
            steps.push({ title: `Mismatch!`, description: `Index ${i}: '${ch}' doesn't match top of stack (${stack.length > 0 ? "'" + stack[stack.length - 1] + "'" : 'empty'}). Invalid!`, highlights: [i], pointers: { i }, stack: [...stack], found: false, result: 'false' });
            valid = false;
            break;
          }
          stack.pop();
          steps.push({ title: `Pop Match`, description: `Index ${i}: '${ch}' matches top '${matchMap[ch]}'. Pop stack.`, highlights: [i], pointers: { i }, stack: [...stack] });
        }
      }
      if (valid) {
        steps.push({ title: stack.length === 0 ? 'Valid!' : 'Invalid!', description: stack.length === 0 ? 'Stack is empty. All brackets matched!' : `Stack not empty: [${stack.join(', ')}]. Invalid.`, highlights: [], pointers: {}, stack: [...stack], found: stack.length === 0, result: stack.length === 0 ? 'true' : 'false' });
      }
      return steps;
    } catch { /* fall through */ }
  }

  // Best Time to Buy and Sell Stock visualization
  if (problemId.includes('stock') || problemId.includes('buy-and-sell')) {
    try {
      const prices: number[] = JSON.parse(tc.input.trim());
      const steps: VizStep[] = [{ title: 'Initialize', description: `Prices: [${prices.join(', ')}]. Set minPrice=${prices[0]}, maxProfit=0.`, highlights: [0], pointers: { buy: 0 } }];
      let minPrice = prices[0], maxProfit = 0, minIdx = 0;
      for (let i = 1; i < prices.length; i++) {
        if (prices[i] < minPrice) {
          minPrice = prices[i]; minIdx = i;
          steps.push({ title: `New Min Price`, description: `Day ${i}: price=${prices[i]} < minPrice. Update minPrice=${prices[i]}.`, highlights: [i], pointers: { buy: i, sell: i }, result: `profit=${maxProfit}` });
        } else {
          const profit = prices[i] - minPrice;
          if (profit > maxProfit) {
            maxProfit = profit;
            steps.push({ title: `New Max Profit!`, description: `Day ${i}: profit=${prices[i]}-${minPrice}=${profit} > ${maxProfit - (profit - maxProfit + maxProfit) + maxProfit === maxProfit ? maxProfit - profit + profit : 0}. Update maxProfit=${maxProfit}.`, highlights: [minIdx, i], pointers: { buy: minIdx, sell: i }, found: true, result: `profit=${maxProfit}` });
          } else {
            steps.push({ title: `Check Day ${i}`, description: `Day ${i}: price=${prices[i]}, profit=${profit}. Not better than ${maxProfit}.`, highlights: [minIdx, i], pointers: { buy: minIdx }, result: `profit=${maxProfit}` });
          }
        }
      }
      steps.push({ title: 'Result', description: `Maximum profit = ${maxProfit}`, highlights: [], pointers: {}, result: String(maxProfit), found: true });
      return steps;
    } catch { /* fall through */ }
  }

  // Generic fallback
  return [
    { title: 'Step 1: Read Input', description: `Parse the input: ${tc.input.substring(0, 80)}...`, highlights: [], pointers: {} },
    { title: 'Step 2: Process', description: 'Apply the algorithm logic to the parsed data.', highlights: [], pointers: {} },
    { title: 'Step 3: Output', description: `Expected output: ${tc.expectedOutput}`, highlights: [], pointers: {}, result: tc.expectedOutput, found: true }
  ];
}

interface AlgorithmVisualizerProps {
  problemId: string;
  category: string;
  testCases: { id: number; input: string; expectedOutput: string }[];
  step: number;
  setStep: (s: number | ((prev: number) => number)) => void;
  playing: boolean;
  setPlaying: (p: boolean) => void;
  speed: number;
  setSpeed: (s: number) => void;
  timerRef: React.MutableRefObject<ReturnType<typeof setInterval> | null>;
  language: string;
}

const VISUALIZER_CODE: Record<string, Record<string, string[]>> = {
  'two-sum': {
    javascript: [
      "function twoSum(nums, target) {",
      "    const map = new Map();",
      "    for (let i = 0; i < nums.length; i++) {",
      "        const complement = target - nums[i];",
      "        if (map.has(complement)) {",
      "            return [map.get(complement), i];",
      "        }",
      "        map.set(nums[i], i);",
      "    }",
      "}"
    ],
    python: [
      "class Solution:",
      "    def twoSum(self, nums: List[int], target: int) -> List[int]:",
      "        seen = {}",
      "        for i, num in enumerate(nums):",
      "            complement = target - num",
      "            if complement in seen:",
      "                return [seen[complement], i]",
      "            seen[num] = i"
    ],
    java: [
      "class Solution {",
      "    public int[] twoSum(int[] nums, int target) {",
      "        Map<Integer, Integer> map = new HashMap<>();",
      "        for (int i = 0; i < nums.length; i++) {",
      "            int complement = target - nums[i];",
      "            if (map.containsKey(complement)) {",
      "                return new int[] { map.get(complement), i };",
      "            }",
      "            map.put(nums[i], i);",
      "        }",
      "        return new int[0];",
      "    }",
      "}"
    ],
    cpp: [
      "class Solution {",
      "public:",
      "    vector<int> twoSum(vector<int>& nums, int target) {",
      "        unordered_map<int, int> map;",
      "        for (int i = 0; i < nums.size(); ++i) {",
      "            int complement = target - nums[i];",
      "            if (map.find(complement) != map.end()) {",
      "                return {map[complement], i};",
      "            }",
      "            map[nums[i]] = i;",
      "        }",
      "        return {};",
      "    }",
      "};"
    ],
    csharp: [
      "public class Solution {",
      "    public int[] TwoSum(int[] nums, int target) {",
      "        var map = new Dictionary<int, int>();",
      "        for (int i = 0; i < nums.Length; i++) {",
      "            int complement = target - nums[i];",
      "            if (map.ContainsKey(complement)) {",
      "                return new int[] { map[complement], i };",
      "            }",
      "            map[nums[i]] = i;",
      "        }",
      "        return new int[0];",
      "    }",
      "}"
    ],
    c: [
      "int* twoSum(int* nums, int numsSize, int target, int* returnSize) {",
      "    for (int i = 0; i < numsSize; i++) {",
      "        int complement = target - nums[i];",
      "        for (int j = 0; j < i; j++) {",
      "            if (nums[j] == complement) {",
      "                int* res = malloc(2 * sizeof(int));",
      "                res[0] = j; res[1] = i;",
      "                *returnSize = 2; return res;",
      "            }",
      "        }",
      "    }",
      "    *returnSize = 0; return NULL;",
      "}"
    ]
  },
  'binary-search': {
    javascript: [
      "var search = function(nums, target) {",
      "    let left = 0, right = nums.length - 1;",
      "    while (left <= right) {",
      "        let mid = Math.floor((left + right) / 2);",
      "        if (nums[mid] === target) {",
      "            return mid;",
      "        } else if (nums[mid] < target) {",
      "            left = mid + 1;",
      "        } else {",
      "            right = mid - 1;",
      "        }",
      "    }",
      "    return -1;",
      "};"
    ],
    python: [
      "class Solution:",
      "    def search(self, nums: List[int], target: int) -> int:",
      "        left, right = 0, len(nums) - 1",
      "        while left <= right:",
      "            mid = (left + right) // 2",
      "            if nums[mid] == target:",
      "                return mid",
      "            elif nums[mid] < target:",
      "                left = mid + 1",
      "            else:",
      "                right = mid - 1",
      "        return -1"
    ],
    java: [
      "class Solution {",
      "    public int search(int[] nums, int target) {",
      "        int left = 0, right = nums.length - 1;",
      "        while (left <= right) {",
      "            int mid = left + (right - left) / 2;",
      "            if (nums[mid] == target) {",
      "                return mid;",
      "            } else if (nums[mid] < target) {",
      "                left = mid + 1;",
      "            } else {",
      "                right = mid - 1;",
      "            }",
      "        }",
      "        return -1;",
      "    }",
      "}"
    ],
    cpp: [
      "class Solution {",
      "public:",
      "    int search(vector<int>& nums, int target) {",
      "        int left = 0, right = nums.size() - 1;",
      "        while (left <= right) {",
      "            int mid = left + (right - left) / 2;",
      "            if (nums[mid] == target) return mid;",
      "            else if (nums[mid] < target) left = mid + 1;",
      "            else right = mid - 1;",
      "        }",
      "        return -1;",
      "    }",
      "};"
    ],
    csharp: [
      "public class Solution {",
      "    public int Search(int[] nums, int target) {",
      "        int left = 0, right = nums.Length - 1;",
      "        while (left <= right) {",
      "            int mid = left + (right - left) / 2;",
      "            if (nums[mid] == target) return mid;",
      "            else if (nums[mid] < target) left = mid + 1;",
      "            else right = mid - 1;",
      "        }",
      "        return -1;",
      "    }",
      "}"
    ],
    c: [
      "int search(int* nums, int numsSize, int target) {",
      "    int left = 0, right = numsSize - 1;",
      "    while (left <= right) {",
      "        int mid = left + (right - left) / 2;",
      "        if (nums[mid] == target) return mid;",
      "        else if (nums[mid] < target) left = mid + 1;",
      "        else right = mid - 1;",
      "    }",
      "    return -1;",
      "}"
    ]
  },
  'valid-parentheses': {
    javascript: [
      "var isValid = function(s) {",
      "    const stack = [];",
      "    const map = { ')': '(', ']': '[', '}': '{' };",
      "    for (let i = 0; i < s.length; i++) {",
      "        let char = s[i];",
      "        if (char === '(' || char === '[' || char === '{') {",
      "            stack.push(char);",
      "        } else {",
      "            if (stack.length === 0 || stack[stack.length - 1] !== map[char]) {",
      "                return false;",
      "            }",
      "            stack.pop();",
      "        }",
      "    }",
      "    return stack.length === 0;",
      "};"
    ],
    python: [
      "class Solution:",
      "    def isValid(self, s: str) -> bool:",
      "        stack = []",
      "        mapping = {')': '(', '}': '{', ']': '['}",
      "        for char in s:",
      "            if char in mapping:",
      "                top_element = stack.pop() if stack else '#'",
      "                if mapping[char] != top_element:",
      "                    return False",
      "            else:",
      "                stack.append(char)",
      "        return not stack"
    ],
    java: [
      "class Solution {",
      "    public boolean isValid(String s) {",
      "        Stack<Character> stack = new Stack<>();",
      "        for (char c : s.toCharArray()) {",
      "            if (c == '(' || c == '[' || c == '{') {",
      "                stack.push(c);",
      "            } else {",
      "                if (stack.isEmpty()) return false;",
      "                char top = stack.pop();",
      "                if (c == ')' && top != '(') return false;",
      "                if (c == ']' && top != '[') return false;",
      "                if (c == '}' && top != '{') return false;",
      "            }",
      "        }",
      "        return stack.isEmpty();",
      "    }",
      "}"
    ],
    cpp: [
      "class Solution {",
      "public:",
      "    bool isValid(string s) {",
      "        stack<char> st;",
      "        for (char c : s) {",
      "            if (c == '(' || c == '[' || c == '{') {",
      "                st.push(c);",
      "            } else {",
      "                if (st.empty() || ",
      "                   (c == ')' && st.top() != '(') ||",
      "                   (c == ']' && st.top() != '[') ||",
      "                   (c == '}' && st.top() != '{')) return false;",
      "                st.pop();",
      "            }",
      "        }",
      "        return st.empty();",
      "    }",
      "};"
    ],
    csharp: [
      "public class Solution {",
      "    public bool IsValid(string s) {",
      "        var stack = new Stack<char>();",
      "        foreach (char c in s) {",
      "            if (c == '(' || c == '[' || c == '{') {",
      "                stack.Push(c);",
      "            } else {",
      "                if (stack.Count == 0) return false;",
      "                char top = stack.Pop();",
      "                if (c == ')' && top != '(') return false;",
      "                if (c == ']' && top != '[') return false;",
      "                if (c == '}' && top != '{') return false;",
      "            }",
      "        }",
      "        return stack.Count == 0;",
      "    }",
      "}"
    ],
    c: [
      "bool isValid(char* s) {",
      "    int len = strlen(s);",
      "    char* stack = malloc(len * sizeof(char));",
      "    int top = -1;",
      "    for (int i = 0; i < len; i++) {",
      "        char c = s[i];",
      "        if (c == '(' || c == '[' || c == '{') {",
      "            stack[++top] = c;",
      "        } else {",
      "            if (top == -1) return false;",
      "            char t = stack[top--];",
      "            if (c == ')' && t != '(') return false;",
      "            if (c == ']' && t != '[') return false;",
      "            if (c == '}' && t != '{') return false;",
      "        }",
      "    }",
      "    bool res = top == -1;",
      "    free(stack); return res;",
      "}"
    ]
  },
  'best-time-to-buy-and-sell-stock': {
    javascript: [
      "var maxProfit = function(prices) {",
      "    let minPrice = prices[0];",
      "    let maxProfit = 0;",
      "    for (let i = 1; i < prices.length; i++) {",
      "        if (prices[i] < minPrice) {",
      "            minPrice = prices[i];",
      "        } else if (prices[i] - minPrice > maxProfit) {",
      "            maxProfit = prices[i] - minPrice;",
      "        }",
      "    }",
      "    return maxProfit;",
      "};"
    ],
    python: [
      "class Solution:",
      "    def maxProfit(self, prices: List[int]) -> int:",
      "        min_price = prices[0]",
      "        max_profit = 0",
      "        for price in prices[1:]:",
      "            if price < min_price:",
      "                min_price = price",
      "            elif price - min_price > max_profit:",
      "                max_profit = price - min_price",
      "        return max_profit"
    ],
    java: [
      "class Solution {",
      "    public int maxProfit(int[] prices) {",
      "        int minPrice = prices[0];",
      "        int maxProfit = 0;",
      "        for (int i = 1; i < prices.length; i++) {",
      "            if (prices[i] < minPrice) {",
      "                minPrice = prices[i];",
      "            } else if (prices[i] - minPrice > maxProfit) {",
      "                maxProfit = prices[i] - minPrice;",
      "            }",
      "        }",
      "        return maxProfit;",
      "    }",
      "}"
    ],
    cpp: [
      "class Solution {",
      "public:",
      "    int maxProfit(vector<int>& prices) {",
      "        int minPrice = prices[0];",
      "        int maxProfit = 0;",
      "        for (int i = 1; i < prices.size(); i++) {",
      "            if (prices[i] < minPrice) minPrice = prices[i];",
      "            else if (prices[i] - minPrice > maxProfit) maxProfit = prices[i] - minPrice;",
      "        }",
      "        return maxProfit;",
      "    }",
      "};"
    ],
    csharp: [
      "public class Solution {",
      "    public int MaxProfit(int[] prices) {",
      "        int minPrice = prices[0];",
      "        int maxProfit = 0;",
      "        for (int i = 1; i < prices.Length; i++) {",
      "            if (prices[i] < minPrice) minPrice = prices[i];",
      "            else if (prices[i] - minPrice > maxProfit) maxProfit = prices[i] - minPrice;",
      "        }",
      "        return maxProfit;",
      "    }",
      "}"
    ],
    c: [
      "int maxProfit(int* prices, int pricesSize) {",
      "    int minPrice = prices[0];",
      "    int maxProfit = 0;",
      "    for (int i = 1; i < pricesSize; i++) {",
      "        if (prices[i] < minPrice) minPrice = prices[i];",
      "        else if (prices[i] - minPrice > maxProfit) maxProfit = prices[i] - minPrice;",
      "    }",
      "    return maxProfit;",
      "}"
    ]
  }
};

function getActiveLine(problemId: string, language: string, stepTitle: string, isFound: boolean): number {
  const cleanId = (problemId || '').toLowerCase();
  const lang = (language || 'javascript').toLowerCase();
  
  if (cleanId.includes('two-sum')) {
    if (stepTitle.includes('Initialize')) return lang === 'python' ? 2 : 1;
    if (stepTitle.includes('Scan') || stepTitle.includes('Index')) return lang === 'python' ? 4 : 3;
    if (isFound || stepTitle.includes('Found')) return lang === 'python' ? 6 : 5;
    return lang === 'python' ? 7 : 7;
  }
  
  if (cleanId.includes('binary-search')) {
    if (stepTitle.includes('Initialize')) return lang === 'python' ? 2 : 1;
    if (stepTitle.includes('Search') || stepTitle.includes('Half')) return lang === 'python' ? 7 : 7;
    if (isFound || stepTitle.includes('Found')) return lang === 'python' ? 5 : 5;
    return lang === 'python' ? 4 : 3;
  }
  
  if (cleanId.includes('parenthes')) {
    if (stepTitle.includes('Initialize')) return lang === 'python' ? 2 : 1;
    if (stepTitle.includes('Push')) return lang === 'python' ? 10 : 6;
    if (stepTitle.includes('Pop')) return lang === 'python' ? 6 : 11;
    if (stepTitle.includes('Mismatch')) return lang === 'python' ? 8 : 9;
    return lang === 'python' ? 11 : 14;
  }

  if (cleanId.includes('stock') || cleanId.includes('buy-and-sell')) {
    if (stepTitle.includes('Initialize')) return lang === 'python' ? 3 : 2;
    if (stepTitle.includes('New Min')) return lang === 'python' ? 6 : 5;
    if (stepTitle.includes('New Max')) return lang === 'python' ? 8 : 7;
    return lang === 'python' ? 5 : 4;
  }
  
  return 0;
}

function AlgorithmVisualizer({ problemId, category, testCases, step, setStep, playing, setPlaying, speed, setSpeed, timerRef, language }: AlgorithmVisualizerProps) {
  const steps = generateSteps(problemId, testCases);
  const totalSteps = steps.length;
  const currentStep = steps[Math.min(step, totalSteps - 1)];

  const cleanId = (problemId || '').toLowerCase();
  const matchedKey = Object.keys(VISUALIZER_CODE).find(k => cleanId.includes(k)) || 'two-sum';
  let langKey = (language || 'javascript').toLowerCase();
  if (langKey === 'c++') langKey = 'cpp';
  const codes = VISUALIZER_CODE[matchedKey];
  const codeLines = codes[langKey] || codes['javascript'] || [];
  
  const activeLine = getActiveLine(matchedKey, langKey, currentStep?.title || '', currentStep?.found || false);

  let displayArray: number[] = [];
  try {
    const firstLine = testCases[0]?.input.split('\n')[0] || '[]';
    const parsed = JSON.parse(firstLine);
    if (Array.isArray(parsed)) displayArray = parsed;
  } catch {}

  let displayString = '';
  if (problemId.includes('parenthes')) {
    displayString = testCases[0]?.input.trim().replace(/^"|"$/g, '') || '';
  }

  useEffect(() => {
    if (playing) {
      timerRef.current = setInterval(() => {
        setStep((prev: number) => {
          if (prev >= totalSteps - 1) {
            setPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [playing, speed, totalSteps]);

  const handlePlayPause = () => {
    if (step >= totalSteps - 1) { setStep(0); setPlaying(true); }
    else setPlaying(!playing);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', height: '100%' }}>
      <style>{`
        @keyframes vizPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.06); } }
        @keyframes vizSlideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes vizHighlight { 0% { box-shadow: 0 0 0 rgba(99,102,241,0); } 50% { box-shadow: 0 0 10px rgba(99,102,241,0.4); } 100% { box-shadow: 0 0 0 rgba(99,102,241,0); } }
        @keyframes stackPush { from { opacity: 0; transform: translateY(-12px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Eye size={14} style={{ color: '#6366f1' }} />
          Interactive Code Visualizer
        </h3>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: '#09090b', padding: '0.15rem 0.5rem', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
          Step {step + 1} / {totalSteps}
        </span>
      </div>

      <div style={{ height: '3px', background: '#1f1f23', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{ height: '100%', background: currentStep.found ? 'var(--success)' : '#6366f1', width: `${((step + 1) / totalSteps) * 100}%`, transition: 'width 0.3s ease' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', flex: 1, minHeight: 0 }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', overflow: 'auto' }}>
          
          <div key={step} style={{ animation: 'vizSlideIn 0.3s ease', background: '#09090b', border: `1px solid ${currentStep.found ? 'rgba(34,197,94,0.3)' : 'var(--border-color)'}`, borderRadius: '0.5rem', padding: '0.75rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: currentStep.found ? 'var(--success)' : '#fff', marginBottom: '0.25rem' }}>
              {currentStep.found ? '✅ ' : '🔍 '}{currentStep.title}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              {currentStep.description}
            </div>
            {currentStep.result && (
              <div style={{ marginTop: '0.4rem', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: currentStep.found ? 'var(--success)' : 'var(--warning)', background: 'rgba(255,255,255,0.01)', padding: '0.2rem 0.4rem', borderRadius: '4px', border: '1px solid var(--border-color)', display: 'inline-block' }}>
                Returns: {currentStep.result}
              </div>
            )}
          </div>

          <div style={{ flex: 1, background: '#09090b', borderRadius: '0.5rem', border: '1px solid var(--border-color)', padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', overflow: 'auto' }}>
            {displayArray.length > 0 && (
              <div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {problemId.includes('stock') ? 'Prices' : 'Array'}
                </div>
                
                <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowX: 'auto', paddingBottom: '1.75rem' }}>
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', height: '45px' }}>
                    {displayArray.map((val, idx) => {
                      const isHighlighted = currentStep.highlights.includes(idx);
                      const isBarChart = problemId.includes('stock');

                      return (
                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          {isBarChart ? (
                            <div style={{
                              width: '24px',
                              height: `${Math.max(val * 2.5, 12)}px`,
                              background: isHighlighted
                                ? (currentStep.found ? 'linear-gradient(to top, #10b981, #34d399)' : 'linear-gradient(to top, var(--primary), #6366f1)')
                                : '#1f1f23',
                              borderRadius: '4px 4px 0 0',
                              transition: 'all 0.25s ease',
                              display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
                              fontSize: '0.6rem', color: '#fff', fontWeight: 900, paddingTop: '3px',
                              boxShadow: isHighlighted ? '0 0 15px var(--primary-glow)' : 'none'
                            }}>
                              {val}
                            </div>
                          ) : (
                            <div style={{
                              width: '32px', height: '32px',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              background: isHighlighted
                                ? (currentStep.found ? 'linear-gradient(135deg, #10b981 0%, #047857 100%)' : 'linear-gradient(135deg, var(--primary) 0%, #4f46e5 100%)')
                                : '#18181b',
                              border: `1.5px solid ${isHighlighted ? '#fff' : 'var(--border-color)'}`,
                              borderRadius: '6px',
                              fontSize: '0.8rem', fontWeight: 900, color: isHighlighted ? '#000' : 'var(--text-main)',
                              fontFamily: 'var(--font-mono)',
                              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                              transform: isHighlighted ? 'translateY(-2px)' : 'translateY(0)',
                              boxShadow: isHighlighted 
                                ? (currentStep.found ? '0 2px 8px rgba(16, 185, 129, 0.25)' : '0 2px 8px rgba(99, 102, 241, 0.25)')
                                : '0 1px 3px rgba(0,0,0,0.2)',
                              animation: isHighlighted ? 'vizPulse 0.4s ease' : 'none'
                            }}>
                              {val}
                            </div>
                          )}
                          <div style={{ fontSize: '0.55rem', color: '#52525b', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>{idx}</div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Absolutely positioned sliding pointer arrows */}
                  {Object.entries(currentStep.pointers).map(([name, idxVal]) => {
                    const idxNum = Number(idxVal);
                    const cellOffset = problemId.includes('stock') ? 28 : 36; // cell width + gap
                    return (
                      <div
                        key={name}
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: `${idxNum * cellOffset}px`,
                          width: `${problemId.includes('stock') ? 24 : 32}px`,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          transition: 'left 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                          pointerEvents: 'none'
                        }}
                      >
                        <span style={{ fontSize: '10px', color: 'var(--primary)', lineHeight: 1 }}>▲</span>
                        <span style={{
                          fontSize: '8px',
                          background: 'var(--primary)',
                          color: '#fff',
                          fontWeight: 900,
                          padding: '1px 4px',
                          borderRadius: '3px',
                          fontFamily: 'var(--font-mono)',
                          boxShadow: '0 0 6px rgba(99,102,241,0.4)',
                          marginTop: '-2px'
                        }}>
                          {name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {displayString && (
              <div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase' }}>String</div>
                
                <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowX: 'auto', paddingBottom: '1.75rem' }}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {displayString.split('').map((ch, idx) => {
                      const isHighlighted = currentStep.highlights.includes(idx);
                      return (
                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <div style={{
                            width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: isHighlighted ? 'linear-gradient(135deg, var(--primary) 0%, #4f46e5 100%)' : '#18181b',
                            border: `1.5px solid ${isHighlighted ? '#fff' : 'var(--border-color)'}`,
                            borderRadius: '6px', fontSize: '0.85rem', fontWeight: 900, fontFamily: 'var(--font-mono)',
                            color: isHighlighted ? '#000' : 'var(--text-main)',
                            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                            transform: isHighlighted ? 'translateY(-2px)' : 'translateY(0)',
                            boxShadow: isHighlighted 
                              ? '0 2px 8px rgba(99, 102, 241, 0.25)'
                              : '0 1px 3px rgba(0,0,0,0.2)',
                            animation: isHighlighted ? 'vizPulse 0.4s ease' : 'none'
                          }}>
                            {ch}
                          </div>
                          <div style={{ fontSize: '0.55rem', color: '#52525b', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>{idx}</div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Absolutely positioned sliding pointer arrows for string */}
                  {Object.entries(currentStep.pointers).map(([name, idxVal]) => {
                    const idxNum = Number(idxVal);
                    const cellOffset = 36; // 32px + 4px gap
                    return (
                      <div
                        key={name}
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: `${idxNum * cellOffset}px`,
                          width: '32px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          transition: 'left 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                          pointerEvents: 'none'
                        }}
                      >
                        <span style={{ fontSize: '10px', color: 'var(--primary)', lineHeight: 1 }}>▲</span>
                        <span style={{
                          fontSize: '8px',
                          background: 'var(--primary)',
                          color: '#fff',
                          fontWeight: 900,
                          padding: '1px 4px',
                          borderRadius: '3px',
                          fontFamily: 'var(--font-mono)',
                          boxShadow: '0 0 6px rgba(99,102,241,0.4)',
                          marginTop: '-2px'
                        }}>
                          {name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {currentStep.stack && (
              <div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '0.3rem', fontWeight: 600, textTransform: 'uppercase' }}>Stack</div>
                <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: '2px', maxHeight: '110px', overflowY: 'auto' }}>
                  {currentStep.stack.length === 0 ? (
                    <div style={{ fontSize: '0.7rem', color: '#52525b', fontStyle: 'italic', padding: '0.4rem', border: '1px dashed var(--border-color)', borderRadius: '4px', textAlign: 'center' }}>Empty Stack</div>
                  ) : currentStep.stack.map((item, idx) => (
                    <div key={idx} style={{
                      padding: '0.2rem 0.5rem', background: idx === currentStep.stack!.length - 1 ? 'rgba(99,102,241,0.1)' : '#18181b',
                      border: `1px solid ${idx === currentStep.stack!.length - 1 ? '#6366f1' : 'var(--border-color)'}`,
                      borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 600,
                      color: idx === currentStep.stack!.length - 1 ? '#fff' : 'var(--text-muted)',
                      textAlign: 'center', animation: 'stackPush 0.25s ease'
                    }}>
                      {item} {idx === currentStep.stack!.length - 1 && <span style={{ fontSize: '0.55rem', color: '#6366f1' }}>← top</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep.hashMap && Object.keys(currentStep.hashMap).length > 0 && (
              <div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '0.3rem', fontWeight: 600, textTransform: 'uppercase' }}>Hash Map (Lookup Table)</div>
                <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
                  {Object.entries(currentStep.hashMap).map(([key, value]) => (
                    <div key={key} style={{
                      display: 'flex', alignItems: 'center', borderRadius: '4px', overflow: 'hidden',
                      border: '1px solid var(--border-color)', animation: 'vizSlideIn 0.25s ease'
                    }}>
                      <span style={{ padding: '0.15rem 0.35rem', background: 'rgba(99,102,241,0.1)', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#6366f1' }}>{key}</span>
                      <span style={{ padding: '0.15rem 0.35rem', background: '#18181b', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: '#fff' }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ background: '#09090b', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '0.75rem', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1f1f23', paddingBottom: '0.4rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Execution Trace ({language})
            </span>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', animation: 'vizPulse 1s infinite' }} />
          </div>
          <div style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: '0.7rem', overflow: 'auto', whiteSpace: 'pre', lineHeight: '1.5' }}>
            {codeLines.map((line, idx) => {
              const isActive = idx === activeLine;
              return (
                <div key={idx} style={{
                  display: 'flex',
                  background: isActive ? 'rgba(99,102,241,0.12)' : 'transparent',
                  borderLeft: `2.5px solid ${isActive ? '#6366f1' : 'transparent'}`,
                  paddingLeft: '0.4rem',
                  color: isActive ? '#fff' : '#71717a',
                  fontWeight: isActive ? 600 : 400
                }}>
                  <span style={{ width: '20px', opacity: 0.3, userSelect: 'none', textAlign: 'right', paddingRight: '0.4rem' }}>{idx + 1}</span>
                  <span>{line}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.75rem', background: '#09090b', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
        <button onClick={() => { setStep(0); setPlaying(false); }} disabled={step === 0}
          style={{ background: 'none', border: 'none', color: step === 0 ? '#333' : 'var(--text-muted)', cursor: step === 0 ? 'default' : 'pointer', padding: '0.3rem', display: 'flex' }}>
          <SkipBack size={14} />
        </button>
        <button onClick={handlePlayPause}
          style={{ background: '#6366f1', border: 'none', color: '#fff', cursor: 'pointer', padding: '0.35rem', borderRadius: '50%', display: 'flex', width: '28px', height: '28px', alignItems: 'center', justifyContent: 'center' }}>
          {playing ? <Pause size={12} /> : <Play size={12} style={{ marginLeft: '1.5px' }} />}
        </button>
        <button onClick={() => { if (step < totalSteps - 1) setStep(step + 1); }} disabled={step >= totalSteps - 1}
          style={{ background: 'none', border: 'none', color: step >= totalSteps - 1 ? '#333' : 'var(--text-muted)', cursor: step >= totalSteps - 1 ? 'default' : 'pointer', padding: '0.3rem', display: 'flex' }}>
          <SkipForward size={14} />
        </button>

        <div style={{ flex: 1 }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
          <FastForward size={10} />
          <input type="range" min={200} max={2000} step={100} value={2200 - speed}
            onChange={e => setSpeed(2200 - Number(e.target.value))}
            style={{ width: '50px', accentColor: '#6366f1' }}
          />
          <span style={{ fontFamily: 'var(--font-mono)', width: '32px' }}>{speed < 500 ? 'Fast' : speed < 1200 ? 'Med' : 'Slow'}</span>
        </div>
      </div>
    </div>
  );
}

const parseVideoUrls = (urlStr?: string): string[] => {
  if (!urlStr) return [];
  try {
    const parsed = JSON.parse(urlStr);
    if (Array.isArray(parsed)) {
      return parsed.filter(Boolean);
    }
  } catch (e) {}
  if (urlStr.includes(',')) {
    return urlStr.split(',').map(s => s.trim()).filter(Boolean);
  }
  return [urlStr.trim()].filter(Boolean);
};

function parseMarkdown(md: string): string {
  if (!md) return '';
  let html = md;
  // Escape HTML characters to prevent XSS but allow our generated tags
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Code blocks: ```lang \n ... \n ```
  html = html.replace(/```(\w*)\r?\n([\s\S]*?)```/g, '<pre style="background:#09090b; border:1px solid #27272a; padding:1rem; border-radius:8px; font-family:monospace; color:#38bdf8; overflow-x:auto; margin:1rem 0; font-size:0.85rem; line-height:1.5;"><code class="language-$1">$2</code></pre>');

  // Headers: ###, ##, #
  html = html.replace(/^### (.*?)$/gm, '<h3 style="color:#fff; font-size:1.1rem; font-weight:600; margin-top:1.25rem; margin-bottom:0.5rem; border-bottom:1px solid #27272a; padding-bottom:4px;">$1</h3>');
  html = html.replace(/^## (.*?)$/gm, '<h2 style="color:#fff; font-size:1.25rem; font-weight:600; margin-top:1.5rem; margin-bottom:0.75rem;">$1</h2>');
  html = html.replace(/^# (.*?)$/gm, '<h1 style="color:#fff; font-size:1.5rem; font-weight:700; margin-top:1.75rem; margin-bottom:1rem;">$1</h1>');

  // Bold **text** or __text__
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong style="color:#fff; font-weight:600;">$1</strong>');
  html = html.replace(/__(.*?)__/g, '<strong style="color:#fff; font-weight:600;">$1</strong>');

  // Italics *text* or _text_
  html = html.replace(/\*(.*?)\*/g, '<em style="color:#e2e8f0;">$1</em>');
  html = html.replace(/_(.*?)_/g, '<em style="color:#e2e8f0;">$1</em>');

  // Inline code `code`
  html = html.replace(/`(.*?)`/g, '<code style="background:#09090b; border:1px solid #27272a; padding:2px 6px; border-radius:4px; font-family:monospace; color:#f43f5e; font-size:0.85rem;">$1</code>');

  // Blockquotes > text
  html = html.replace(/^> (.*?)$/gm, '<blockquote style="border-left:4px solid var(--primary); padding-left:1rem; color:var(--text-muted); margin:1rem 0;">$1</blockquote>');

  // Lists: * item or - item
  html = html.replace(/^\* (.*?)$/gm, '<li style="margin-left:1.25rem; list-style-type:disc; margin-bottom:0.25rem;">$1</li>');
  html = html.replace(/^- (.*?)$/gm, '<li style="margin-left:1.25rem; list-style-type:disc; margin-bottom:0.25rem;">$1</li>');

  // Convert newlines (excluding headers/list items) to paragraphs
  const paragraphs = html.split(/\n\n+/);
  html = paragraphs.map(p => {
    p = p.trim();
    if (!p) return '';
    if (p.startsWith('<h') || p.startsWith('<li') || p.startsWith('<block') || p.startsWith('<ul') || p.startsWith('<pre')) {
      return p;
    }
    return `<p style="margin-bottom:0.85rem;">${p.replace(/\n/g, '<br />')}</p>`;
  }).join('\n');

  return html;
}

export default function CodingWorkspace({ problemId, onBack, currentUser }: CodingWorkspaceProps) {
  const [problem, setProblem] = useState<ProblemDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('javascript');
  const [editorCode, setEditorCode] = useState('');
  
  // Keep track of code written in other languages so switching languages doesn't wipe progress
  const codeCache = useRef<Record<string, string>>({});
  
  // UI Tabs & Console states
  const [leftTab, setLeftTab] = useState<'desc' | 'submissions' | 'video' | 'visualizer' | 'ai-coach'>('desc');

  // Visualizer states
  const [vizStep, setVizStep] = useState(0);
  const [vizPlaying, setVizPlaying] = useState(false);
  const [vizSpeed, setVizSpeed] = useState(1000);
  const vizTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [consoleOpen, setConsoleOpen] = useState(true);
  const [executing, setExecuting] = useState(false);
  const [execResult, setExecResult] = useState<any>(null);
  const [submissionsList, setSubmissionsList] = useState<any[]>([]);
  const [adminVideoUrls, setAdminVideoUrls] = useState<string[]>([]);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [savingVideo, setSavingVideo] = useState(false);
  
  // AI Coach states
  const [aiHistory, setAiHistory] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: '### PrepArena AI Code Coach online.\n\nSelect a directive below or ask a custom question about your code. I can analyze logic, find bugs, explain complexities, and suggest optimizations.' }
  ]);
  const [aiCustomQuestion, setAiCustomQuestion] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiLoadingText, setAiLoadingText] = useState('');

  const handleAiDirective = (type: 'explain' | 'optimize' | 'bugs' | 'ask', customQuery?: string) => {
    setAiLoading(true);
    let prompt = '';
    let loadingMsg = '';
    
    if (type === 'explain') {
      prompt = 'Explain the optimal approach for solving the problem: ' + (problem?.title || problemId);
      loadingMsg = 'Analyzing problem specifications...';
    } else if (type === 'optimize') {
      prompt = `Optimize the following code in ${language} for time/space complexity:\n\`\`\`${language}\n${editorCode}\n\`\`\``;
      loadingMsg = 'Parsing AST & evaluating loop bounds...';
    } else if (type === 'bugs') {
      prompt = `Dry run this code and find logical bugs or boundary conditions:\n\`\`\`${language}\n${editorCode}\n\`\`\``;
      loadingMsg = 'Running virtual compiler & checking edge cases...';
    } else {
      prompt = customQuery || '';
      loadingMsg = 'Processing directive...';
    }

    setAiLoadingText(loadingMsg);
    
    // Add user message to history
    setAiHistory(prev => [...prev, { role: 'user', content: prompt }]);

    // Simulated responses based on problemId for realistic coaching
    let reply = '';
    const cleanProbId = (problemId || '').toLowerCase();
    
    setTimeout(() => {
      setAiLoadingText('Generating recommendations...');
      
      setTimeout(() => {
        if (type === 'explain') {
          if (cleanProbId.includes('two-sum')) {
            reply = `### Optimal Approach for Two Sum\n\nTo solve Two Sum in **$O(N)$ Time** and **$O(N)$ Space**, we use a single pass traversal combined with a hash table.\n\n1. **Core Strategy**: As we iterate through the array, we check if the complement (\`target - nums[i]\`) is present in our hash table.\n2. **Action**:\n   * If yes: Return the index stored in the hash table along with the current index.\n   * If no: Store the value and its index (\`nums[i]: i\`) in the hash table.\n\n#### Complexity Matrix\n* **Time Complexity**: $O(N)$ — we traverse the array of length $N$ exactly once. Each hash table lookup takes $O(1)$ average time.\n* **Space Complexity**: $O(N)$ — in the worst case, we store up to $N$ elements in our hash table.`;
          } else if (cleanProbId.includes('binary-search')) {
            reply = `### Optimal Approach for Binary Search\n\nFor a sorted input array, we utilize **$O(\\log N)$ Time** using pointer reductions.\n\n1. **Core Strategy**: Set two pointers: \`left = 0\` and \`right = nums.length - 1\`.\n2. **Iteration**:\n   * Find the middle index: \`mid = Math.floor((left + right) / 2)\`.\n   * Compare \`nums[mid]\` with \`target\`.\n   * Adjust range bounds dynamically:\n     * If equal: target found!\n     * If \`nums[mid] < target\`: narrow range to the right half (\`left = mid + 1\`).\n     * If \`nums[mid] > target\`: narrow range to the left half (\`right = mid - 1\`).\n\n#### Complexity Matrix\n* **Time Complexity**: $O(\\log N)$ — the search space is cut in half at each iteration.\n* **Space Complexity**: $O(1)$ — only pointers are allocated.`;
          } else if (cleanProbId.includes('valid-parentheses') || cleanProbId.includes('parenthes')) {
            reply = `### Optimal Approach for Valid Parentheses\n\nWe use a **LIFO Stack** to parse matching brackets in **$O(N)$ Time** and **$O(N)$ Space**.\n\n1. **Core Strategy**:\n   * Loop through characters in string.\n   * Push opening brackets (\`(\`, \`[\`, \`{\`) onto a stack.\n   * On encountering a closing bracket, pop the stack and check if it matches the closing bracket.\n   * If the stack is empty or mismatched, return \`false\`.\n2. **Success Condition**: The stack must be completely empty after iterating through all brackets.\n\n#### Complexity Matrix\n* **Time Complexity**: $O(N)$ — single pass over the string.\n* **Space Complexity**: $O(N)$ — worst case stack contains all opening brackets.`;
          } else if (cleanProbId.includes('stock') || cleanProbId.includes('buy-and-sell')) {
            reply = `### Optimal Approach for Buy and Sell Stock\n\nWe solve this in **$O(N)$ Time** and **$O(1)$ Space** using a single-pass greedy traversal.\n\n1. **Core Strategy**:\n   * Maintain a running \`minPrice\` initialized to infinity.\n   * Maintain a running \`maxProfit\` initialized to 0.\n   * For each price, update \`minPrice\` if the price is lower. Otherwise, calculate the potential profit (\`price - minPrice\`) and update \`maxProfit\` if it exceeds the current value.\n\n#### Complexity Matrix\n* **Time Complexity**: $O(N)$ — single pass array scan.\n* **Space Complexity**: $O(1)$ — constant scalar memory.`;
          } else {
            reply = `### Optimal Algorithmic Approach\n\nFor the problem **${problem?.title || problemId}**:\n\n1. **Goal**: Identify the patterns and constraints.\n2. **Strategy**:\n   * Analyze the input bounds: If $N \\le 10^5$, look for $O(N)$ or $O(N \\log N)$ solutions.\n   * Check if sorting, binary search, two-pointers, or hash maps can optimize the time bounds from $O(N^2)$ brute force to $O(N)$.\n   * Use pre-computed states (dynamic programming or memoization) for overlapping subproblems.\n\nPlease click **Optimize Complexity** or **Dry Run** to check your specific code implementation!`;
          }
        } else if (type === 'optimize') {
          if (cleanProbId.includes('two-sum')) {
            reply = `### Time Complexity Optimization: O(N)\n\nYour code was analyzed. Here is the highly optimized $O(N)$ time solution using a Hash Map:\n\n\`\`\`javascript\nfunction twoSum(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) {\n            return [map.get(complement), i];\n        }\n        map.set(nums[i], i);\n    }\n    return [];\n}\n\`\`\`\n\n#### Improvements Made\n* **Reduced Time Complexity**: From $O(N^2)$ (brute-force nested loops) to $O(N)$ by replacing the inner search loop with a constant time $O(1)$ Hash Map check.\n* **Modern Syntax**: Utilized JavaScript Map for high performance.`;
          } else if (cleanProbId.includes('binary-search')) {
            reply = `### Iterative Optimization: O(log N) Time / O(1) Space\n\nHere is the optimal iterative implementation to avoid call-stack overhead:\n\n\`\`\`javascript\nfunction search(nums, target) {\n    let left = 0;\n    let right = nums.length - 1;\n    \n    while (left <= right) {\n        // Prevent potential integer overflow\n        const mid = left + Math.floor((right - left) / 2);\n        \n        if (nums[mid] === target) {\n            return mid;\n        } else if (nums[mid] < target) {\n            left = mid + 1;\n        } else {\n            right = mid - 1;\n        }\n    }\n    return -1;\n}\n\`\`\`\n\n#### Key Details\n* **Overflow Protection**: Used \`left + Math.floor((right - left) / 2)\` to prevent integer overflow.\n* **Constant Space**: Avoided recursive call-stack allocations, keeping memory usage at strictly $O(1)$.`;
          } else {
            reply = `### Algorithmic Optimization Recommendation\n\nTo optimize your current code:\n* **Avoid Nested Loops**: Replace nested $O(N^2)$ loops with a single loop by utilizing a Hash Map or Set.\n* **Pre-sorting**: Sorting elements in $O(N \\log N)$ time can enable the use of Two-Pointers.\n* **Recursive Call Pruning**: If using recursion, ensure memoization is implemented to prevent exponential $O(2^N)$ time complexity.`;
          }
        } else if (type === 'bugs') {
          reply = `### Virtual Compilation & Bug Detection Report\n\n**Status**: SCAN COMPLETED\n\n1. **Boundary Values Check**:\n   * Verify input length checks: Added safeguard if \`nums.length < 2\` (for Two Sum) or string length is empty (for Parentheses).\n2. **Logic & Indexing Checks**:\n   * Checked array indices to make sure no out-of-bounds access occurs.\n   * If the input contains duplicate values, ensure your map/cache structure doesn't overwrite necessary indices.\n3. **Recommendations**:\n   * Ensure correct return types on empty/null states (e.g. return \`[]\` or \`-1\` based on problem definitions).\n   * Double check strict inequality checks on your pointers (\`left <= right\` vs \`left < right\`).`;
        } else {
          reply = `### AI Coach Response\n\nRegarding your question about **"${customQuery}"**:\n\n* **Analysis**: Checked the active Monaco editor buffer.\n* **Logic Evaluation**: Your current logic handles core cases successfully. Ensure that you test edge cases (e.g., negative integers, empty bounds, single item arrays).\n* **Code complexity**: Your current function implements standard language conventions.\n\nLet me know if you would like me to optimize a specific segment of this code!`;
        }

        setAiHistory(prev => [...prev, { role: 'assistant', content: reply }]);
        setAiLoading(false);
      }, 1000);
    }, 1000);
  };

  const getYouTubeId = (url?: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleSaveVideoUrl = () => {
    if (!problem || !currentUser) return;
    setSavingVideo(true);
    const filteredUrls = adminVideoUrls.map(u => u.trim()).filter(Boolean);
    fetch(`http://localhost:5015/api/admin/problems/${problemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Email': currentUser.email
      },
      body: JSON.stringify({
        id: problem.id,
        title: problem.title,
        difficulty: problem.difficulty,
        category: problem.category,
        description: problem.description,
        videoUrl: JSON.stringify(filteredUrls),
        timeLimitMs: problem.timeLimitMs,
        memoryLimitMb: problem.memoryLimitMb,
        csharpBoilerplate: problem.boilerplates.csharp || '',
        javaBoilerplate: problem.boilerplates.java || '',
        pythonBoilerplate: problem.boilerplates.python || '',
        cppBoilerplate: problem.boilerplates.cpp || '',
        cBoilerplate: problem.boilerplates.c || '',
        jsBoilerplate: problem.boilerplates.javascript || ''
      })
    })
      .then(res => {
        if (!res.ok) throw new Error('Save failed');
        return res.json();
      })
      .then(data => {
        setProblem({
          ...problem,
          videoUrl: data.videoUrl
        });
        setAdminVideoUrls(parseVideoUrls(data.videoUrl));
        setSavingVideo(false);
      })
      .catch(err => {
        console.error(err);
        setSavingVideo(false);
      });
  };

  useEffect(() => {
    // Fetch problem details
    fetch(`http://localhost:5015/api/problems/${problemId}`)
      .then(res => res.json())
      .then(data => {
        setProblem(data);
        setAdminVideoUrls(parseVideoUrls(data.videoUrl));
        
        // Initialize boilerplates
        const boilerplates = data.boilerplates || {};
        codeCache.current = { ...boilerplates };
        
        // Select starting language
        const defaultLang = 'javascript';
        setLanguage(defaultLang);
        setEditorCode(boilerplates[defaultLang] || '');
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching problem details:', err);
        setLoading(false);
      });

    fetchSubmissions();
  }, [problemId]);

  const fetchSubmissions = () => {
    const headers: Record<string, string> = {};
    if (currentUser) {
      headers['X-User-Email'] = currentUser.email;
    }
    fetch(`http://localhost:5015/api/problems/submissions?problemId=${problemId}`, { headers })
      .then(res => res.json())
      .then(data => {
        setSubmissionsList(data);
      })
      .catch(err => console.error('Error fetching submissions:', err));
  };

  const handleLanguageChange = (newLang: string) => {
    // Cache current code
    codeCache.current[language] = editorCode;
    // Set new language
    setLanguage(newLang);
    // Load cached code or fallback
    setEditorCode(codeCache.current[newLang] || problem?.boilerplates[newLang] || '');
  };

  const handleRunCode = () => {
    if (!problem) return;
    setExecuting(true);
    setConsoleOpen(true);
    setExecResult(null);

    fetch(`http://localhost:5015/api/problems/${problemId}/run`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-User-Email': currentUser?.email || ''
      },
      body: JSON.stringify({ code: editorCode, language })
    })
      .then(res => res.json())
      .then(data => {
        setExecResult({ ...data, type: 'run' });
        setExecuting(false);
      })
      .catch(err => {
        console.error(err);
        setExecResult({ status: 'Runtime Error', compilerMessage: 'Network error communicating with compiler engine.' });
        setExecuting(false);
      });
  };

  const handleSubmitCode = () => {
    if (!problem) return;
    setExecuting(true);
    setConsoleOpen(true);
    setExecResult(null);

    fetch(`http://localhost:5015/api/problems/${problemId}/submit`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-User-Email': currentUser?.email || ''
      },
      body: JSON.stringify({ code: editorCode, language })
    })
      .then(res => res.json())
      .then(data => {
        setExecResult({ ...data, type: 'submit' });
        setExecuting(false);
        fetchSubmissions();

        if (data.status === 'Accepted') {
          // Play confetti!
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      })
      .catch(err => {
        console.error(err);
        setExecResult({ status: 'Runtime Error', compilerMessage: 'Network error submitting solution.' });
        setExecuting(false);
      });
  };

  const handleVisualizeCode = () => {
    setLeftTab('visualizer');
    setVizStep(0);
    setVizPlaying(true);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid var(--border-color)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>Problem not found.</h2>
        <button className="btn btn-secondary" onClick={onBack} style={{ marginTop: '1rem' }}><ArrowLeft size={16} /> Back to Arena</button>
      </div>
    );
  }

  const monacoLanguageMap: Record<string, string> = {
    csharp: 'csharp',
    java: 'java',
    python: 'python',
    cpp: 'cpp',
    c: 'c',
    javascript: 'javascript'
  };

  const attempts = submissionsList.length;
  const isSolved = submissionsList.some(sub => sub.status === 'Accepted');
  const isVideoUnlocked = isSolved || attempts >= 2;

  return (
    <div className="animate-fade-in workspace-container">
      
      {/* Left panel: Description & Submissions */}
      <div className="workspace-left cyber-panel" style={{ padding: '0' }}>
        <div className="tab-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '1rem', overflow: 'hidden' }}>
          <div style={{ display: 'flex', overflowX: 'auto', whiteSpace: 'nowrap', flex: 1, scrollbarWidth: 'none' }} className="tab-scroll-container">
            <div 
              className={`tab ${leftTab === 'desc' ? 'active' : ''}`}
              onClick={() => setLeftTab('desc')}
              style={{ flexShrink: 0 }}
            >
              Description
            </div>
            <div 
              className={`tab ${leftTab === 'submissions' ? 'active' : ''}`}
              onClick={() => setLeftTab('submissions')}
              style={{ flexShrink: 0 }}
            >
              Submissions ({submissionsList.length})
            </div>
            <div 
              className={`tab ${leftTab === 'video' ? 'active' : ''}`}
              onClick={() => setLeftTab('video')}
              style={{ flexShrink: 0 }}
            >
              Video {!isVideoUnlocked && '🔒'}
            </div>
            <div 
              className={`tab ${leftTab === 'visualizer' ? 'active' : ''}`}
              onClick={() => setLeftTab('visualizer')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flexShrink: 0 }}
            >
              <Eye size={12} /> Visualizer
            </div>
            <div 
              className={`tab ${leftTab === 'ai-coach' ? 'active' : ''}`}
              onClick={() => setLeftTab('ai-coach')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flexShrink: 0 }}
            >
              <Sparkles size={12} style={{ color: '#6366f1' }} /> AI Code Coach
            </div>
          </div>
          <button className="btn btn-secondary" style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem', height: '28px', flexShrink: 0, marginLeft: '0.5rem' }} onClick={onBack}>
            <ArrowLeft size={12} /> Back
          </button>
        </div>

        <div className="tab-content" style={{ background: 'transparent', border: 'none' }}>
          {leftTab === 'desc' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', margin: 0 }}>{problem.title}</h2>
                <span className={`difficulty-badge difficulty-${problem.difficulty.toLowerCase()}`}>
                  {problem.difficulty}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: '#09090b', padding: '0.25rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                  {problem.category}
                </span>
              </div>

              {/* Markdown Render Wrapper */}
              <div 
                style={{ lineHeight: '1.6', fontSize: '0.9rem', color: 'var(--text-muted)' }}
                dangerouslySetInnerHTML={{ __html: parseMarkdown(problem.description) }}
              />

              {/* Sample test cases preview */}
              <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, borderBottom: '1px solid var(--border-color)', paddingBottom: '0.35rem', color: '#fff', margin: 0 }}>Sample Test Cases</h3>
                {problem.testCases.map((tc, idx) => (
                  <div key={tc.id} style={{ background: '#09090b', padding: '0.85rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Example {idx + 1}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr', gap: '0.35rem', fontSize: '0.8rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Input:</span>
                      <pre style={{ fontFamily: 'var(--font-mono)', background: 'rgba(255,255,255,0.01)', padding: '0.2rem', borderRadius: '4px', whiteSpace: 'pre-wrap', color: '#fff' }}>{tc.input}</pre>
                      <span style={{ color: 'var(--text-muted)' }}>Expected:</span>
                      <pre style={{ fontFamily: 'var(--font-mono)', background: 'rgba(255,255,255,0.01)', padding: '0.2rem', borderRadius: '4px', whiteSpace: 'pre-wrap', color: '#fff' }}>{tc.expectedOutput}</pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {leftTab === 'submissions' && (
            // Submissions List
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem', color: '#fff' }}>Submission History</h3>
              {submissionsList.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem', fontSize: '0.85rem' }}>No submissions yet for this problem.</div>
              ) : (
                submissionsList.map((sub) => (
                  <div key={sub.id} style={{
                    padding: '0.85rem',
                    background: '#09090b',
                    borderRadius: '0.5rem',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        {sub.status === 'Accepted' ? (
                          <CheckCircle2 size={14} style={{ color: 'var(--success)' }} />
                        ) : (
                          <X size={14} style={{ color: 'var(--danger)' }} />
                        )}
                        <span style={{ fontWeight: 600, fontSize: '0.85rem', color: sub.status === 'Accepted' ? 'var(--success)' : 'var(--danger)' }}>{sub.status}</span>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {new Date(sub.submittedAt).toLocaleString()}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Language: <span style={{ color: '#fff', fontWeight: 500 }}>{sub.language.toUpperCase()}</span> • Run Time: <span style={{ color: '#fff', fontWeight: 500 }}>{sub.executionTimeMs} ms</span>
                    </div>
                    {sub.compilerMessage && (
                      <pre style={{
                        background: 'rgba(239, 68, 68, 0.03)',
                        border: '1px solid rgba(239, 68, 68, 0.15)',
                        padding: '0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontFamily: 'var(--font-mono)',
                        color: '#fca5a5',
                        overflowX: 'auto',
                        whiteSpace: 'pre-wrap'
                      }}>
                        {sub.compilerMessage}
                      </pre>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {leftTab === 'visualizer' && problem && (
            <AlgorithmVisualizer
              problemId={problem.id}
              category={problem.category}
              testCases={problem.testCases}
              step={vizStep}
              setStep={setVizStep}
              playing={vizPlaying}
              setPlaying={setVizPlaying}
              speed={vizSpeed}
              setSpeed={setVizSpeed}
              timerRef={vizTimerRef}
              language={language}
            />
          )}

          {leftTab === 'video' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
              {!isVideoUnlocked ? (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '3rem 1.5rem',
                  textAlign: 'center',
                  background: '#09090b',
                  borderRadius: '0.5rem',
                  border: '1px solid var(--border-color)',
                  gap: '0.85rem'
                }}>
                  <div style={{
                    fontSize: '1.5rem',
                    background: '#27272a',
                    border: '1px solid var(--border-color)',
                    padding: '0.85rem',
                    borderRadius: '50%',
                    width: '48px',
                    height: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    🔒
                  </div>
                  <h3 style={{ margin: 0, fontSize: '1rem', color: '#fff' }}>Video solution locked</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '280px', lineHeight: '1.5', margin: 0 }}>
                    Try solving the problem first! Submit at least 2 attempts to unlock the solution explanation.
                  </p>
                  <div style={{
                    fontSize: '0.8rem',
                    background: '#18181b',
                    padding: '0.4rem 1rem',
                    borderRadius: '2rem',
                    border: '1px solid var(--border-color)',
                    fontWeight: 600,
                    color: '#fff'
                  }}>
                    Attempts: {attempts} / 2
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#fff' }}>Video Solution Walkthrough</h3>
                    {isSolved && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.2rem', fontWeight: 600 }}>
                        <CheckCircle2 size={12} /> Unlocked (Solved)
                      </span>
                    )}
                  </div>

                  {(() => {
                    const videoUrls = parseVideoUrls(problem.videoUrl);
                    const currentUrl = videoUrls[activeVideoIndex] || videoUrls[0] || '';
                    const ytId = getYouTubeId(currentUrl);
                    
                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
                        {videoUrls.length > 1 && (
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', background: 'rgba(255,255,255,0.02)', padding: '0.25rem', borderRadius: '0.375rem', border: '1px solid var(--border-color)' }}>
                            {videoUrls.map((_, idx) => (
                              <button
                                key={idx}
                                className={`btn ${activeVideoIndex === idx ? 'btn-primary' : 'btn-secondary'}`}
                                style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', border: 'none' }}
                                onClick={() => setActiveVideoIndex(idx)}
                              >
                                Video Solution #{idx + 1}
                              </button>
                            ))}
                          </div>
                        )}
                        
                        {currentUrl && ytId ? (
                          <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', height: 0, borderRadius: '0.5rem', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                            <iframe
                              src={`https://www.youtube.com/embed/${ytId}`}
                              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              title="YouTube video player"
                            />
                          </div>
                        ) : (
                          <div style={{ padding: '2rem', textAlign: 'center', background: '#09090b', borderRadius: '0.5rem', border: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                            No video walkthrough URL has been assigned to this challenge yet.
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {currentUser?.role === 'Admin' && (
                    <div className="glass-panel" style={{ marginTop: '1.5rem', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', background: '#09090b' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#fff' }}>
                          ⚙️ System Admin Controls: Manage Video Solutions
                        </span>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}
                          onClick={() => setAdminVideoUrls([...adminVideoUrls, ''])}
                        >
                          + Add Link
                        </button>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {(adminVideoUrls.length > 0 ? adminVideoUrls : ['']).map((url, idx) => (
                          <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <input
                              type="url"
                              placeholder="YouTube URL (e.g. https://www.youtube.com/watch?v=...)"
                              value={url}
                              onChange={(e) => {
                                const newUrls = [...adminVideoUrls];
                                if (newUrls.length === 0) newUrls.push(e.target.value);
                                else newUrls[idx] = e.target.value;
                                setAdminVideoUrls(newUrls);
                              }}
                              style={{
                                flex: 1,
                                background: '#18181b',
                                border: '1px solid var(--border-color)',
                                borderRadius: '0.375rem',
                                padding: '0.45rem',
                                color: '#fff',
                                fontSize: '0.8rem',
                                outline: 'none'
                              }}
                            />
                            <button
                              type="button"
                              className="btn btn-secondary"
                              style={{ padding: '0.45rem', color: 'var(--danger)', border: 'none' }}
                              onClick={() => {
                                const newUrls = [...adminVideoUrls];
                                newUrls.splice(idx, 1);
                                setAdminVideoUrls(newUrls.length > 0 ? newUrls : ['']);
                              }}
                              disabled={adminVideoUrls.length <= 1 && url === ''}
                            >
                              Remove
                            </button>
                          </div>
                        ))}

                        <button
                          className="btn btn-primary"
                          style={{ padding: '0.45rem 1rem', fontSize: '0.8rem', marginTop: '0.5rem', alignSelf: 'flex-end' }}
                          onClick={handleSaveVideoUrl}
                          disabled={savingVideo}
                        >
                          {savingVideo ? 'Saving...' : 'Save All Video Links'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {leftTab === 'ai-coach' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', height: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Sparkles size={18} style={{ color: '#6366f1', filter: 'drop-shadow(0 0 4px rgba(99,102,241,0.5))' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', margin: 0 }}>AI Code Coach</h3>
              </div>

              {/* Directive quick actions */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                <button 
                  onClick={() => handleAiDirective('explain')}
                  disabled={aiLoading}
                  style={{
                    padding: '0.75rem',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)'; e.currentTarget.style.background = 'rgba(99,102,241,0.02)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                >
                  <Brain size={13} style={{ color: '#6366f1' }} /> Explain Approach
                </button>
                <button 
                  onClick={() => handleAiDirective('optimize')}
                  disabled={aiLoading}
                  style={{
                    padding: '0.75rem',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)'; e.currentTarget.style.background = 'rgba(99,102,241,0.02)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                >
                  <Cpu size={13} style={{ color: '#38bdf8' }} /> Optimize Complexity
                </button>
                <button 
                  onClick={() => handleAiDirective('bugs')}
                  disabled={aiLoading}
                  style={{
                    padding: '0.75rem',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)'; e.currentTarget.style.background = 'rgba(99,102,241,0.02)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                >
                  <ShieldAlert size={13} style={{ color: '#ef4444' }} /> Dry Run / Bug Finder
                </button>
                <button 
                  onClick={() => handleAiDirective('ask', 'Analyze overall clean code structure and variable naming.')}
                  disabled={aiLoading}
                  style={{
                    padding: '0.75rem',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)'; e.currentTarget.style.background = 'rgba(99,102,241,0.02)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                >
                  <Terminal size={13} style={{ color: '#10b981' }} /> Code Quality Review
                </button>
              </div>

              {/* Chat history readout */}
              <div 
                className="drawer-scroller" 
                style={{ 
                  flex: 1, 
                  overflowY: 'auto', 
                  border: '1px solid rgba(255,255,255,0.03)', 
                  background: '#09090b', 
                  borderRadius: '12px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}
              >
                {aiHistory.map((msg, idx) => (
                  <div 
                    key={idx} 
                    style={{ 
                      alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                      maxWidth: '85%',
                      background: msg.role === 'user' ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.01)',
                      border: '1px solid ' + (msg.role === 'user' ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.03)'),
                      borderRadius: msg.role === 'user' ? '12px 12px 0 12px' : '12px 12px 12px 0',
                      padding: '0.75rem 1rem',
                      fontSize: '0.85rem',
                      lineHeight: '1.5'
                    }}
                  >
                    <span style={{ 
                      display: 'block', 
                      fontSize: '9px', 
                      fontWeight: 800, 
                      color: msg.role === 'user' ? '#c084fc' : 'var(--text-muted)',
                      textTransform: 'uppercase',
                      marginBottom: '4px',
                      letterSpacing: '0.5px'
                    }}>
                      {msg.role === 'user' ? 'Directive' : 'AI Coach'}
                    </span>
                    <div 
                      style={{ color: msg.role === 'user' ? '#e9d5ff' : '#d1d5db' }}
                      dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.content) }}
                    />
                  </div>
                ))}
                {aiLoading && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', alignSelf: 'flex-start', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', padding: '0.75rem 1rem', borderRadius: '12px 12px 12px 0' }}>
                    <Cpu size={14} className="spin" style={{ color: '#6366f1', animation: 'spin 1.5s linear infinite' }} />
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      {aiLoadingText}
                    </span>
                  </div>
                )}
              </div>

              {/* Chat Input form */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!aiCustomQuestion.trim() || aiLoading) return;
                  handleAiDirective('ask', aiCustomQuestion);
                  setAiCustomQuestion('');
                }}
                style={{ display: 'flex', gap: '0.5rem' }}
              >
                <input
                  type="text"
                  placeholder="Ask the AI Coach a custom question..."
                  value={aiCustomQuestion}
                  onChange={(e) => setAiCustomQuestion(e.target.value)}
                  disabled={aiLoading}
                  style={{
                    flex: 1,
                    background: '#09090b',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '0.65rem 0.85rem',
                    color: '#fff',
                    fontSize: '0.85rem',
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ padding: '0.65rem 1.25rem', fontSize: '0.8rem', borderRadius: '8px' }}
                  disabled={aiLoading || !aiCustomQuestion.trim()}
                >
                  Ask
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Right panel: Editor & Console */}
      <div className="workspace-right cyber-panel" style={{ padding: '0' }}>
        
        {/* Editor Settings Panel */}
        <div className="tab-container" style={{ padding: '0.5rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Cpu size={14} style={{ color: 'var(--primary)' }} />
            <span style={{ fontWeight: 500, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Language:</span>
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              style={{
                background: '#09090b',
                color: '#fff',
                border: '1px solid var(--border-color)',
                padding: '0.3rem 0.5rem',
                borderRadius: '0.375rem',
                fontSize: '0.8rem',
                outline: 'none',
                fontWeight: 600
              }}
            >
              <option value="javascript">JavaScript (Node.js)</option>
              <option value="csharp">C# (.NET 10)</option>
              <option value="python">Python 3</option>
              <option value="java">Java (JDK 21)</option>
              <option value="cpp">C++ (g++)</option>
              <option value="c">C (gcc)</option>
            </select>
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              className="btn btn-secondary" 
              style={{ 
                padding: '0.35rem 0.85rem', 
                fontSize: '0.8rem', 
                background: 'rgba(99,102,241,0.15)', 
                border: '1px solid rgba(99,102,241,0.3)', 
                color: '#c084fc',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }} 
              onClick={handleVisualizeCode}
            >
              <Eye size={12} /> Visualize
            </button>
            <button className="btn btn-secondary" style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem' }} onClick={handleRunCode} disabled={executing}>
              <Play size={10} style={{ fill: 'currentColor' }} /> Run Code
            </button>
            <button className="btn btn-primary" style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem' }} onClick={handleSubmitCode} disabled={executing}>
              <Check size={10} /> Submit
            </button>
          </div>
        </div>

        {/* Monaco Editor Wrapper */}
        <div style={{ flex: 1, minHeight: 0, border: '1px solid var(--border-color)', borderTop: 'none', background: '#1e1e1e' }}>
          <Editor
            height="100%"
            language={monacoLanguageMap[language]}
            theme="vs-dark"
            value={editorCode}
            onChange={(val) => setEditorCode(val ?? '')}
            options={{
              fontSize: 13,
              fontFamily: 'var(--font-mono)',
              minimap: { enabled: false },
              automaticLayout: true,
              scrollBeyondLastLine: false,
              cursorBlinking: 'smooth',
              cursorSmoothCaretAnimation: 'on',
              padding: { top: 10, bottom: 10 }
            }}
          />
        </div>

        {/* Console drawer */}
        <div className="console-drawer" style={{ height: consoleOpen ? '220px' : '40px' }}>
          <div className="console-header" onClick={() => setConsoleOpen(!consoleOpen)} style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 600 }}>
              <Terminal size={12} style={{ color: 'var(--primary)' }} />
              Console
            </div>
            {consoleOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </div>

          {consoleOpen && (
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', background: '#09090b', color: '#e5e7eb' }}>
              {executing ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)' }}>
                  <div style={{ width: '10px', height: '10px', border: '2px solid var(--border-color)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                  <span>Running code compiler on server sandbox...</span>
                </div>
              ) : execResult ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {/* Status row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                    {execResult.status === 'Accepted' ? (
                      <CheckCircle2 size={14} style={{ color: 'var(--success)', filter: 'drop-shadow(0 0 4px rgba(16, 185, 129, 0.4))' }} />
                    ) : (
                      <ShieldAlert size={14} style={{ color: 'var(--danger)', filter: 'drop-shadow(0 0 4px rgba(244, 63, 94, 0.4))' }} />
                    )}
                    <span style={{ fontWeight: 700, color: execResult.status === 'Accepted' ? 'var(--success)' : 'var(--danger)', fontSize: '0.9rem' }}>
                      {execResult.status} {execResult.type === 'submit' ? '(All Tests)' : '(Sample Run)'}
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                      in {execResult.executionTimeMs} ms
                    </span>
                  </div>

                  {/* Errors / Warnings */}
                  {execResult.compilerMessage && (
                    <div style={{ background: 'rgba(244, 63, 94, 0.03)', padding: '0.75rem', borderLeft: '3px solid var(--danger)', borderRadius: '4px', border: '1px solid rgba(244, 63, 94, 0.15)', fontFamily: 'var(--font-mono)' }}>
                      <div style={{ color: 'var(--danger)', fontWeight: 600, marginBottom: '0.2rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Compiler Diagnostics:</div>
                      <pre style={{ whiteSpace: 'pre-wrap', color: '#fecdd3', fontSize: '0.75rem', lineHeight: '1.4' }}>{execResult.compilerMessage}</pre>
                    </div>
                  )}

                  {/* Output details for incorrect runs */}
                  {execResult.status !== 'Accepted' && execResult.failedTestCaseIndex !== undefined && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(245, 158, 11, 0.02)', padding: '0.75rem', borderRadius: '4px', border: '1px solid rgba(245, 158, 11, 0.1)' }}>
                      <div style={{ color: 'var(--warning)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Failed Test Case Assertion</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Test Index: <span style={{ color: '#fff', fontWeight: 600 }}>#{execResult.failedTestCaseIndex + 1}</span></div>
                      {execResult.actualOutput && (
                        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '0.35rem', fontFamily: 'var(--font-mono)' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Actual Output:</span>
                          <span style={{ color: 'var(--danger)', background: 'rgba(244, 63, 94, 0.08)', padding: '2px 6px', borderRadius: '3px', border: '1px solid rgba(244, 63, 94, 0.15)', display: 'inline-block', justifySelf: 'start', fontSize: '0.75rem' }}>{execResult.actualOutput}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Success */}
                  {execResult.status === 'Accepted' && (
                    <div style={{ color: 'var(--success)', fontWeight: 500 }}>
                      🎉 Excellent job! All test assertions completed successfully.
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ color: 'var(--text-muted)' }}>
                  Output console. Compile or Run code to view standard output details.
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
