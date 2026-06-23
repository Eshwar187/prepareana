const fs = require('fs');
const path = require('path');

const problemsData = [
  // Array / String
  {
    id: "merge-sorted-array",
    title: "Merge Sorted Array",
    difficulty: "Easy",
    category: "Array / String",
    desc: "You are given two integer arrays nums1 and nums2, sorted in non-decreasing order, and two integers m and n, representing the number of elements in nums1 and nums2 respectively.\n\nMerge nums1 and nums2 into a single array sorted in non-decreasing order.",
    csharp_bp: "public class Solution {\n    public void Merge(int[] nums1, int m, int[] nums2, int n) {\n        \n    }\n}",
    java_bp: "class Solution {\n    public void merge(int[] nums1, int m, int[] nums2, int n) {\n        \n    }\n}",
    python_bp: "class Solution:\n    def merge(self, nums1: list[int], m: int, nums2: list[int], n: int) -> None:\n        pass",
    cpp_bp: "class Solution {\npublic:\n    void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {\n        \n    }\n};",
    c_bp: "void merge(int* nums1, int nums1Size, int m, int* nums2, int nums2Size, int n) {\n\n}",
    js_bp: "var merge = function(nums1, m, nums2, n) {\n    \n};",
    tc_input: "[1,2,3,0,0,0]\n3\n[2,5,6]\n3",
    tc_output: "[1,2,2,3,5,6]"
  },
  {
    id: "remove-element",
    title: "Remove Element",
    difficulty: "Easy",
    category: "Array / String",
    desc: "Given an integer array nums and an integer val, remove all occurrences of val in nums in-place. The order of the elements may be changed. Then return the number of elements in nums which are not equal to val.",
    csharp_bp: "public class Solution {\n    public int RemoveElement(int[] nums, int val) {\n        \n    }\n}",
    java_bp: "class Solution {\n    public int removeElement(int[] nums, int val) {\n        \n    }\n}",
    python_bp: "class Solution:\n    def removeElement(self, nums: list[int], val: int) -> int:\n        pass",
    cpp_bp: "class Solution {\npublic:\n    int removeElement(vector<int>& nums, int val) {\n        \n    }\n};",
    c_bp: "int removeElement(int* nums, int numsSize, int val) {\n\n}",
    js_bp: "var removeElement = function(nums, val) {\n    \n};",
    tc_input: "[3,2,2,3]\n3",
    tc_output: "2"
  },
  {
    id: "remove-duplicates-from-sorted-array",
    title: "Remove Duplicates from Sorted Array",
    difficulty: "Easy",
    category: "Array / String",
    desc: "Given an integer array nums sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once. The relative order of the elements should be kept the same. Then return the number of unique elements in nums.",
    csharp_bp: "public class Solution {\n    public int RemoveDuplicates(int[] nums) {\n        \n    }\n}",
    java_bp: "class Solution {\n    public int removeDuplicates(int[] nums) {\n        \n    }\n}",
    python_bp: "class Solution:\n    def removeDuplicates(self, nums: list[int]) -> int:\n        pass",
    cpp_bp: "class Solution {\npublic:\n    int removeDuplicates(vector<int>& nums) {\n        \n    }\n};",
    c_bp: "int removeDuplicates(int* nums, int numsSize) {\n\n}",
    js_bp: "var removeDuplicates = function(nums) {\n    \n};",
    tc_input: "[1,1,2]",
    tc_output: "2"
  },
  {
    id: "remove-duplicates-from-sorted-array-ii",
    title: "Remove Duplicates from Sorted Array II",
    difficulty: "Medium",
    category: "Array / String",
    desc: "Given an integer array nums sorted in non-decreasing order, remove some duplicates in-place such that each unique element appears at most twice. The relative order of the elements should be kept the same.",
    csharp_bp: "public class Solution {\n    public int RemoveDuplicates(int[] nums) {\n        \n    }\n}",
    java_bp: "class Solution {\n    public int removeDuplicates(int[] nums) {\n        \n    }\n}",
    python_bp: "class Solution:\n    def removeDuplicates(self, nums: list[int]) -> int:\n        pass",
    cpp_bp: "class Solution {\npublic:\n    int removeDuplicates(vector<int>& nums) {\n        \n    }\n};",
    c_bp: "int removeDuplicates(int* nums, int numsSize) {\n\n}",
    js_bp: "var removeDuplicates = function(nums) {\n    \n};",
    tc_input: "[1,1,1,2,2,3]",
    tc_output: "5"
  },
  {
    id: "majority-element",
    title: "Majority Element",
    difficulty: "Easy",
    category: "Array / String",
    desc: "Given an array nums of size n, return the majority element. The majority element is the element that appears more than ⌊n / 2⌋ times.",
    csharp_bp: "public class Solution {\n    public int MajorityElement(int[] nums) {\n        \n    }\n}",
    java_bp: "class Solution {\n    public int majorityElement(int[] nums) {\n        \n    }\n}",
    python_bp: "class Solution:\n    def majorityElement(self, nums: list[int]) -> int:\n        pass",
    cpp_bp: "class Solution {\npublic:\n    int majorityElement(vector<int>& nums) {\n        \n    }\n};",
    c_bp: "int majorityElement(int* nums, int numsSize) {\n\n}",
    js_bp: "var majorityElement = function(nums) {\n    \n};",
    tc_input: "[3,2,3]",
    tc_output: "3"
  },
  {
    id: "rotate-array",
    title: "Rotate Array",
    difficulty: "Medium",
    category: "Array / String",
    desc: "Given an integer array nums, rotate the array to the right by k steps, where k is non-negative.",
    csharp_bp: "public class Solution {\n    public void Rotate(int[] nums, int k) {\n        \n    }\n}",
    java_bp: "class Solution {\n    public void rotate(int[] nums, int k) {\n        \n    }\n}",
    python_bp: "class Solution:\n    def rotate(self, nums: list[int], k: int) -> None:\n        pass",
    cpp_bp: "class Solution {\npublic:\n    void rotate(vector<int>& nums, int k) {\n        \n    }\n};",
    c_bp: "void rotate(int* nums, int numsSize, int k) {\n\n}",
    js_bp: "var rotate = function(nums, k) {\n    \n};",
    tc_input: "[1,2,3,4,5,6,7]\n3",
    tc_output: "[5,6,7,1,2,3,4]"
  },
  {
    id: "best-time-to-buy-and-sell-stock-ii",
    title: "Best Time to Buy and Sell Stock II",
    difficulty: "Medium",
    category: "Array / String",
    desc: "You are given an integer array prices where prices[i] is the price of a given stock on the i-th day.\n\nOn each day, you may decide to buy and/or sell the stock. You can only hold at most one share of the stock at any time. Find and return the maximum profit you can achieve.",
    csharp_bp: "public class Solution {\n    public int MaxProfit(int[] prices) {\n        \n    }\n}",
    java_bp: "class Solution {\n    public int maxProfit(int[] prices) {\n        \n    }\n}",
    python_bp: "class Solution:\n    def maxProfit(self, prices: list[int]) -> int:\n        pass",
    cpp_bp: "class Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        \n    }\n};",
    c_bp: "int maxProfit(int* prices, int pricesSize) {\n\n}",
    js_bp: "var maxProfit = function(prices) {\n    \n};",
    tc_input: "[7,1,5,3,6,4]",
    tc_output: "7"
  },
  {
    id: "jump-game",
    title: "Jump Game",
    difficulty: "Medium",
    category: "Array / String",
    desc: "You are given an integer array nums. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position.\n\nReturn true if you can reach the last index, or false otherwise.",
    csharp_bp: "public class Solution {\n    public bool CanJump(int[] nums) {\n        \n    }\n}",
    java_bp: "class Solution {\n    public boolean canJump(int[] nums) {\n        \n    }\n}",
    python_bp: "class Solution:\n    def canJump(self, nums: list[int]) -> bool:\n        pass",
    cpp_bp: "class Solution {\npublic:\n    bool canJump(vector<int>& nums) {\n        \n    }\n};",
    c_bp: "bool canJump(int* nums, int numsSize) {\n\n}",
    js_bp: "var canJump = function(nums) {\n    \n};",
    tc_input: "[2,3,1,1,4]",
    tc_output: "true"
  },
  {
    id: "jump-game-ii",
    title: "Jump Game II",
    difficulty: "Medium",
    category: "Array / String",
    desc: "You are given a 0-indexed array of integers nums of length n. You are initially positioned at nums[0].\n\nYour goal is to reach the last index in the minimum number of jumps.",
    csharp_bp: "public class Solution {\n    public int Jump(int[] nums) {\n        \n    }\n}",
    java_bp: "class Solution {\n    public int jump(int[] nums) {\n        \n    }\n}",
    python_bp: "class Solution:\n    def jump(self, nums: list[int]) -> int:\n        pass",
    cpp_bp: "class Solution {\npublic:\n    int jump(vector<int>& nums) {\n        \n    }\n};",
    c_bp: "int jump(int* nums, int numsSize) {\n\n}",
    js_bp: "var jump = function(nums) {\n    \n};",
    tc_input: "[2,3,1,1,4]",
    tc_output: "2"
  },
  {
    id: "h-index",
    title: "H-Index",
    difficulty: "Medium",
    category: "Array / String",
    desc: "Given an array of integers citations where citations[i] is the number of citations a researcher received for their i-th paper, return the researcher's h-index.",
    csharp_bp: "public class Solution {\n    public int HIndex(int[] citations) {\n        \n    }\n}",
    java_bp: "class Solution {\n    public int hIndex(int[] citations) {\n        \n    }\n}",
    python_bp: "class Solution:\n    def hIndex(self, citations: list[int]) -> int:\n        pass",
    cpp_bp: "class Solution {\npublic:\n    int hIndex(vector<int>& citations) {\n        \n    }\n};",
    c_bp: "int hIndex(int* citations, int citationsSize) {\n\n}",
    js_bp: "var hIndex = function(citations) {\n    \n};",
    tc_input: "[3,0,6,1,5]",
    tc_output: "3"
  },
  {
    id: "insert-delete-getrandom-o1",
    title: "Insert Delete GetRandom O(1)",
    difficulty: "Medium",
    category: "Array / String",
    desc: "Implement the RandomizedSet class:\n\n- RandomizedSet() Initializes the RandomizedSet object.\n- bool insert(int val) Inserts an item val into the set if not present. Returns true if the item was not present, false otherwise.\n- bool remove(int val) Removes an item val from the set if present. Returns true if the item was present, false otherwise.\n- int getRandom() Returns a random element from the current set of elements.",
    csharp_bp: "public class RandomizedSet {\n    public RandomizedSet() {\n        \n    }\n    public bool Insert(int val) {\n        return false;\n    }\n    public bool Remove(int val) {\n        return false;\n    }\n    public int GetRandom() {\n        return 0;\n    }\n}",
    java_bp: "class RandomizedSet {\n    public RandomizedSet() {\n        \n    }\n    public boolean insert(int val) {\n        return false;\n    }\n    public boolean remove(int val) {\n        return false;\n    }\n    public int getRandom() {\n        return 0;\n    }\n}",
    python_bp: "class RandomizedSet:\n    def __init__(self):\n        pass\n    def insert(self, val: int) -> bool:\n        return False\n    def remove(self, val: int) -> bool:\n        return False\n    def getRandom(self) -> int:\n        return 0",
    cpp_bp: "class RandomizedSet {\npublic:\n    RandomizedSet() {\n        \n    }\n    bool insert(int val) {\n        return false;\n    }\n    bool remove(int val) {\n        return false;\n    }\n    int getRandom() {\n        return 0;\n    }\n};",
    c_bp: "typedef struct {\n    int vals[1000];\n    int size;\n} RandomizedSet;\nRandomizedSet* randomizedSetCreate() {\n    RandomizedSet* s = malloc(sizeof(RandomizedSet));\n    s->size = 0;\n    return s;\n}\nbool randomizedSetInsert(RandomizedSet* obj, int val) {\n    return false;\n}\nbool randomizedSetRemove(RandomizedSet* obj, int val) {\n    return false;\n}\nint randomizedSetGetRandom(RandomizedSet* obj) {\n    return 0;\n}\nvoid randomizedSetFree(RandomizedSet* obj) {\n    free(obj);\n}",
    js_bp: "var RandomizedSet = function() {\n    this.set = new Set();\n};\nRandomizedSet.prototype.insert = function(val) {\n    if (this.set.has(val)) return false;\n    this.set.add(val);\n    return true;\n};\nRandomizedSet.prototype.remove = function(val) {\n    if (!this.set.has(val)) return false;\n    this.set.delete(val);\n    return true;\n};\nRandomizedSet.prototype.getRandom = function() {\n    const arr = Array.from(this.set);\n    return arr[Math.floor(Math.random() * arr.length)];\n};",
    tc_input: "[\"RandomizedSet\",\"insert\",\"remove\",\"insert\",\"getRandom\",\"remove\",\"insert\",\"getRandom\"]\n[[],[1],[2],[2],[],[1],[2],[]]",
    tc_output: "[null,true,false,true,2,true,false,2]"
  },
  {
    id: "product-of-array-except-self",
    title: "Product of Array Except Self",
    difficulty: "Medium",
    category: "Array / String",
    desc: "Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].",
    csharp_bp: "public class Solution {\n    public int[] ProductExceptSelf(int[] nums) {\n        \n    }\n}",
    java_bp: "class Solution {\n    public int[] productExceptSelf(int[] nums) {\n        \n    }\n}",
    python_bp: "class Solution:\n    def productExceptSelf(self, nums: list[int]) -> list[int]:\n        pass",
    cpp_bp: "class Solution {\npublic:\n    vector<int> productExceptSelf(vector<int>& nums) {\n        \n    }\n};",
    c_bp: "int* productExceptSelf(int* nums, int numsSize, int* returnSize) {\n\n}",
    js_bp: "var productExceptSelf = function(nums) {\n    \n};",
    tc_input: "[1,2,3,4]",
    tc_output: "[24,12,8,6]"
  },
  {
    id: "gas-station",
    title: "Gas Station",
    difficulty: "Medium",
    category: "Array / String",
    desc: "There are n gas stations along a circular route, where the amount of gas at the i-th station is gas[i].\n\nYou have a car with an unlimited gas tank and it costs cost[i] of gas to travel from the i-th station to its next (i + 1)-th station. You begin the journey with an empty tank at one of the gas stations.\n\nGiven two integer arrays gas and cost, return the starting gas station's index if you can travel around the circuit once in the clockwise direction, otherwise return -1.",
    csharp_bp: "public class Solution {\n    public int CanCompleteCircuit(int[] gas, int[] cost) {\n        \n    }\n}",
    java_bp: "class Solution {\n    public int canCompleteCircuit(int[] gas, int[] cost) {\n        \n    }\n}",
    python_bp: "class Solution:\n    def canCompleteCircuit(self, gas: list[int], cost: list[int]) -> int:\n        pass",
    cpp_bp: "class Solution {\npublic:\n    int canCompleteCircuit(vector<int>& gas, vector<int>& cost) {\n        \n    }\n};",
    c_bp: "int canCompleteCircuit(int* gas, int gasSize, int* cost, int costSize) {\n\n}",
    js_bp: "var canCompleteCircuit = function(gas, cost) {\n    \n};",
    tc_input: "[1,2,3,4,5]\n[3,4,5,1,2]",
    tc_output: "3"
  },
  {
    id: "candy",
    title: "Candy",
    difficulty: "Hard",
    category: "Array / String",
    desc: "There are n children standing in a line. Each child is assigned a rating value given in the integer array ratings.\n\nYou are giving candies to these children subjected to the following requirements:\n- Each child must have at least one candy.\n- Children with a higher rating get more candies than their neighbors.\n\nReturn the minimum candies you must give.",
    csharp_bp: "public class Solution {\n    public int Candy(int[] ratings) {\n        \n    }\n}",
    java_bp: "class Solution {\n    public int candy(int[] ratings) {\n        \n    }\n}",
    python_bp: "class Solution:\n    def candy(self, ratings: list[int]) -> int:\n        pass",
    cpp_bp: "class Solution {\npublic:\n    int candy(vector<int>& ratings) {\n        \n    }\n};",
    c_bp: "int candy(int* ratings, int ratingsSize) {\n\n}",
    js_bp: "var candy = function(ratings) {\n    \n};",
    tc_input: "[1,0,2]",
    tc_output: "5"
  },
  {
    id: "trapping-rain-water",
    title: "Trapping Rain Water",
    difficulty: "Hard",
    category: "Array / String",
    desc: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    csharp_bp: "public class Solution {\n    public int Trap(int[] height) {\n        \n    }\n}",
    java_bp: "class Solution {\n    public int trap(int[] height) {\n        \n    }\n}",
    python_bp: "class Solution:\n    def trap(self, height: list[int]) -> int:\n        pass",
    cpp_bp: "class Solution {\npublic:\n    int trap(vector<int>& height) {\n        \n    }\n};",
    c_bp: "int trap(int* height, int heightSize) {\n\n}",
    js_bp: "var trap = function(height) {\n    \n};",
    tc_input: "[0,1,0,2,1,0,1,3,2,1,2,1]",
    tc_output: "6"
  },
  // Preseeded 10 problems added here directly to seed from JSON
  {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    category: "Arrays & Hashing",
    desc: "Given an array of integers `nums` and an integer `target`, return *indices of the two numbers such that they add up to `target`*.\n\nYou may assume that each input would have ***exactly* one solution**, and you may not use the *same* element twice.\n\nYou can return the answer in any order.\n\n### Example 1:\n**Input:** nums = [2,7,11,15], target = 9\n**Output:** [0,1]\n**Explanation:** Because nums[0] + nums[1] == 9, we return [0, 1].\n\n### Example 2:\n**Input:** nums = [3,2,4], target = 6\n**Output:** [1,2]\n\n### Example 3:\n**Input:** nums = [3,3], target = 6\n**Output:** [0,1]\n\n### Constraints:\n* `2 <= nums.length <= 10^4`\n* `-10^9 <= nums[i] <= 10^9`\n* `-10^9 <= target <= 10^9`\n* **Only one valid answer exists.**",
    csharp_bp: "public class Solution {\n    public int[] TwoSum(int[] nums, int target) {\n        \n    }\n}",
    java_bp: "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        \n    }\n}",
    python_bp: "class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        pass",
    cpp_bp: "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        \n    }\n};",
    c_bp: "int* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    \n}",
    js_bp: "var twoSum = function(nums, target) {\n    \n};",
    tc_input: "[2,7,11,15]\n9",
    tc_output: "[0,1]"
  },
  {
    id: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "Easy",
    category: "Stacks",
    desc: "Given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.\n\n### Example 1:\n**Input:** s = \"()\"\n**Output:** true\n\n### Example 2:\n**Input:** s = \"()[]{}\"\n**Output:** true\n\n### Example 3:\n**Input:** s = \"(]\"\n**Output:** false\n\n### Constraints:\n* `1 <= s.length <= 10^4`\n* `s` consists of parentheses only: `'()[]{}'`.",
    csharp_bp: "public class Solution {\n    public bool IsValid(string s) {\n        \n    }\n}",
    java_bp: "class Solution {\n    public boolean isValid(String s) {\n        \n    }\n}",
    python_bp: "class Solution:\n    def isValid(self, s: str) -> bool:\n        pass",
    cpp_bp: "class Solution {\npublic:\n    bool isValid(string s) {\n        \n    }\n};",
    c_bp: "bool isValid(char* s) {\n    \n}",
    js_bp: "var isValid = function(s) {\n    \n};",
    tc_input: "\"()\"",
    tc_output: "true"
  },
  {
    id: "best-time-to-buy-and-sell-stock",
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    category: "Sliding Window",
    desc: "You are given an array `prices` where `prices[i]` is the price of a given stock on the `i-th` day.\n\nYou want to maximize your profit by choosing a **single day** to buy one stock and choosing a **different day in the future** to sell that stock.\n\nReturn *the maximum profit you can achieve from this transaction*. If you cannot achieve any profit, return `0`.\n\n### Example 1:\n**Input:** prices = [7,1,5,3,6,4]\n**Output:** 5\n**Explanation:** Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6 - 1 = 5.\nNote that buying on day 2 and selling on day 1 is not allowed because you must buy before you sell.\n\n### Example 2:\n**Input:** prices = [7,6,4,3,1]\n**Output:** 0\n**Explanation:** In this case, no transactions are done and max profit = 0.\n\n### Constraints:\n* `1 <= prices.length <= 10^5`\n* `0 <= prices[i] <= 10^4`",
    csharp_bp: "public class Solution {\n    public int MaxProfit(int[] prices) {\n        \n    }\n}",
    java_bp: "class Solution {\n    public int maxProfit(int[] prices) {\n        \n    }\n}",
    python_bp: "class Solution:\n    def maxProfit(self, prices: list[int]) -> int:\n        pass",
    cpp_bp: "class Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        \n    }\n};",
    c_bp: "int maxProfit(int* prices, int pricesSize) {\n    \n}",
    js_bp: "var maxProfit = function(prices) {\n    \n};",
    tc_input: "[7,1,5,3,6,4]",
    tc_output: "5"
  },
  {
    id: "binary-search",
    title: "Binary Search",
    difficulty: "Easy",
    category: "Binary Search",
    desc: "Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return `-1`.\n\nYou must write an algorithm with `O(log n)` runtime complexity.\n\n### Example 1:\n**Input:** nums = [-1,0,3,5,9,12], target = 9\n**Output:** 4\n**Explanation:** 9 exists in nums and its index is 4.\n\n### Example 2:\n**Input:** nums = [-1,0,3,5,9,12], target = 2\n**Output:** -1\n**Explanation:** 2 does not exist in nums so return -1.\n\n### Constraints:\n* `1 <= nums.length <= 10^4`\n* `-10^4 < nums[i], target < 10^4`\n* All the integers in `nums` are **unique**.\n* `nums` is sorted in ascending order.",
    csharp_bp: "public class Solution {\n    public int Search(int[] nums, int target) {\n        \n    }\n}",
    java_bp: "class Solution {\n    public int search(int[] nums, int target) {\n        \n    }\n}",
    python_bp: "class Solution:\n    def search(self, nums: list[int], target: int) -> int:\n        pass",
    cpp_bp: "class Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        \n    }\n};",
    c_bp: "int search(int* nums, int numsSize, int target) {\n    \n}",
    js_bp: "var search = function(nums, target) {\n    \n};",
    tc_input: "[-1,0,3,5,9,12]\n9",
    tc_output: "4"
  },
  {
    id: "reverse-linked-list",
    title: "Reverse Linked List",
    difficulty: "Easy",
    category: "Linked List",
    desc: "Given the `head` of a singly linked list, reverse the list, and return *the reversed list*.",
    csharp_bp: "public class ListNode {\n    public int val;\n    public ListNode next;\n    public ListNode(int val=0, ListNode next=null) {\n        this.val = val;\n        this.next = next;\n    }\n}\n\npublic class Solution {\n    public ListNode ReverseList(ListNode head) {\n        \n    }\n}",
    java_bp: "class ListNode {\n    int val;\n    ListNode next;\n    ListNode(int val) { this.val = val; }\n}\nclass Solution {\n    public ListNode reverseList(ListNode head) {\n        \n    }\n}",
    python_bp: "class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\nclass Solution:\n    def reverseList(self, head: ListNode) -> ListNode:\n        pass",
    cpp_bp: "struct ListNode {\n    int val;\n    ListNode *next;\n    ListNode(int x) : val(x), next(nullptr) {}\n};\nclass Solution {\npublic:\n    ListNode* reverseList(ListNode* head) {\n        \n    }\n};",
    c_bp: "struct ListNode {\n    int val;\n    struct ListNode *next;\n};\nstruct ListNode* reverseList(struct ListNode* head) {\n    \n}",
    js_bp: "function ListNode(val, next) {\n    this.val = (val===undefined ? 0 : val)\n    this.next = (next===undefined ? null : next)\n}\nvar reverseList = function(head) {\n    \n};",
    tc_input: "[1,2,3,4,5]",
    tc_output: "[5,4,3,2,1]"
  },
  {
    id: "merge-two-sorted-lists",
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    category: "Linked List",
    desc: "You are given the heads of two sorted linked lists `list1` and `list2`.\n\nMerge the two lists into one sorted list.",
    csharp_bp: "public class ListNode {\n    public int val;\n    public ListNode next;\n    public ListNode(int val=0, ListNode next=null) {\n        this.val = val;\n        this.next = next;\n    }\n}\n\npublic class Solution {\n    public ListNode MergeTwoLists(ListNode list1, ListNode list2) {\n        \n    }\n}",
    java_bp: "class ListNode {\n    int val;\n    ListNode next;\n    ListNode(int val) { this.val = val; }\n}\nclass Solution {\n    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n        \n    }\n}",
    python_bp: "class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\nclass Solution:\n    def mergeTwoLists(self, list1: ListNode, list2: ListNode) -> ListNode:\n        pass",
    cpp_bp: "struct ListNode {\n    int val;\n    ListNode *next;\n    ListNode(int x) : val(x), next(nullptr) {}\n};\nclass Solution {\npublic:\n    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {\n        \n    }\n};",
    c_bp: "struct ListNode {\n    int val;\n    struct ListNode *next;\n};\nstruct ListNode* mergeTwoLists(struct ListNode* list1, struct ListNode* list2) {\n    \n}",
    js_bp: "function ListNode(val, next) {\n    this.val = (val===undefined ? 0 : val)\n    this.next = (next===undefined ? null : next)\n}\nvar mergeTwoLists = function(list1, list2) {\n    \n};",
    tc_input: "[1,2,4]\n[1,3,4]",
    tc_output: "[1,1,2,3,4,4]"
  },
  {
    id: "longest-substring-without-repeating-characters",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    category: "Sliding Window",
    desc: "Given a string `s`, find the length of the **longest substring** without repeating characters.",
    csharp_bp: "public class Solution {\n    public int LengthOfLongestSubstring(string s) {\n        \n    }\n}",
    java_bp: "class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        \n    }\n}",
    python_bp: "class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        pass",
    cpp_bp: "class Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        \n    }\n};",
    c_bp: "int lengthOfLongestSubstring(char* s) {\n    \n}",
    js_bp: "var lengthOfLongestSubstring = function(s) {\n    \n};",
    tc_input: "\"abcabcbb\"",
    tc_output: "3"
  },
  {
    id: "container-with-most-water",
    title: "Container With Most Water",
    difficulty: "Medium",
    category: "Two Pointers",
    desc: "You are given an integer array `height` of length `n`.\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water.\n\nReturn *the maximum amount of water a container can store*.",
    csharp_bp: "public class Solution {\n    public int MaxArea(int[] height) {\n        \n    }\n}",
    java_bp: "class Solution {\n    public int maxArea(int[] height) {\n        \n    }\n}",
    python_bp: "class Solution:\n    def maxArea(self, height: list[int]) -> int:\n        pass",
    cpp_bp: "class Solution {\npublic:\n    int maxArea(vector<int>& height) {\n        \n    }\n};",
    c_bp: "int maxArea(int* height, int heightSize) {\n    \n}",
    js_bp: "var maxArea = function(height) {\n    \n};",
    tc_input: "[1,8,6,2,5,4,8,3,7]",
    tc_output: "49"
  },
  {
    id: "valid-anagram",
    title: "Valid Anagram",
    difficulty: "Easy",
    category: "Arrays & Hashing",
    desc: "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.",
    csharp_bp: "public class Solution {\n    public bool IsAnagram(string s, string t) {\n        \n    }\n}",
    java_bp: "class Solution {\n    public boolean isAnagram(String s, String t) {\n        \n    }\n}",
    python_bp: "class Solution:\n    def isAnagram(self, s: str, t: str) -> bool:\n        pass",
    cpp_bp: "class Solution {\npublic:\n    bool isAnagram(string s, string t) {\n        \n    }\n};",
    c_bp: "bool isAnagram(char* s, char* t) {\n    \n}",
    js_bp: "var isAnagram = function(s, t) {\n    \n};",
    tc_input: "\"anagram\"\n\"nagaram\"",
    tc_output: "true"
  },
  {
    id: "invert-binary-tree",
    title: "Invert Binary Tree",
    difficulty: "Easy",
    category: "Trees",
    desc: "Given the `root` of a binary tree, invert the tree, and return *its root*.",
    csharp_bp: "public class TreeNode {\n    public int val;\n    public TreeNode left;\n    public TreeNode right;\n    public TreeNode(int val=0, TreeNode left=null, TreeNode right=null) {\n        this.val = val;\n        this.left = left;\n        this.right = right;\n    }\n}\n\npublic class Solution {\n    public TreeNode InvertTree(TreeNode root) {\n        \n    }\n}",
    java_bp: "class TreeNode {\n    int val;\n    TreeNode left;\n    TreeNode right;\n    TreeNode(int val) { this.val = val; }\n}\nclass Solution {\n    public TreeNode invertTree(TreeNode root) {\n        \n    }\n}",
    python_bp: "class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\nclass Solution:\n    def invertTree(self, root: TreeNode) -> TreeNode:\n        pass",
    cpp_bp: "struct TreeNode {\n    int val;\n    TreeNode *left;\n    TreeNode *right;\n    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}\n};\nclass Solution {\npublic:\n    TreeNode* invertTree(TreeNode* root) {\n        \n    }\n};",
    c_bp: "struct TreeNode {\n    int val;\n    struct TreeNode *left;\n    struct TreeNode *right;\n};\nstruct TreeNode* invertTree(struct TreeNode* root) {\n    \n}",
    js_bp: "function TreeNode(val, left, right) {\n    this.val = (val===undefined ? 0 : val)\n    this.left = (left===undefined ? null : left)\n    this.right = (right===undefined ? null : right)\n}\nvar invertTree = function(root) {\n    \n};",
    tc_input: "[4,2,7,1,3,6,9]",
    tc_output: "[4,7,2,9,6,3,1]"
  },
  {
    id: "evaluate-reverse-polish-notation",
    title: "Evaluate Reverse Polish Notation",
    difficulty: "Medium",
    category: "Stack",
    desc: "You are given an array of strings `tokens` that represents an arithmetic expression in a [Reverse Polish Notation](http://en.wikipedia.org/wiki/Reverse_Polish_notation).\n\nEvaluate the expression. Return *an integer that represents the value of the expression*.\n\n**Note** that:\n- The valid operators are `'+'`, `'-'`, `'*'`, and `'/'`.\n- Each operand may be an integer or another expression.\n- The division between two integers always truncates toward zero.\n- There will not be any division by zero.\n- The input represents a valid arithmetic expression in a reverse polish notation.\n- The answer and all the intermediate calculations can be represented in a **32-bit** integer.",
    csharp_bp: "public class Solution {\n    public int EvalRPN(string[] tokens) {\n        \n    }\n}",
    java_bp: "class Solution {\n    public int evalRPN(String[] tokens) {\n        \n    }\n}",
    python_bp: "class Solution:\n    def evalRPN(self, tokens: list[str]) -> int:\n        pass",
    cpp_bp: "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    int evalRPN(vector<string>& tokens) {\n        \n    }\n};",
    c_bp: "int evalRPN(char** tokens, int tokensSize) {\n    \n}",
    js_bp: "var evalRPN = function(tokens) {\n    \n};",
    tc_input: "[\"2\",\"1\",\"+\",\"3\",\"*\"]",
    tc_output: "9"
  }
];

const subItems = {
  "Two Pointers": [
    ["valid-palindrome", "Valid Palindrome", "Easy", "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward."],
    ["is-subsequence", "Is Subsequence", "Easy", "Given two strings s and t, return true if s is a subsequence of t, or false otherwise."],
    ["two-sum-ii-input-array-is-sorted", "Two Sum II - Input Array Is Sorted", "Medium", "Given a 1-indexed array of integers numbers that is already sorted in non-decreasing order, find two numbers such that they add up to a specific target number."],
    ["3sum", "3Sum", "Medium", "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0."]
  ],
  "Sliding Window": [
    ["minimum-size-subarray-sum", "Minimum Size Subarray Sum", "Medium", "Given an array of positive integers nums and a positive integer target, return the minimal length of a subarray whose sum is greater than or equal to target."],
    ["substring-with-concatenation-of-all-words", "Substring with Concatenation of All Words", "Hard", "You are given a string s and an array of strings words. All the strings of words are of the same length."],
    ["minimum-window-substring", "Minimum Window Substring", "Hard", "Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t (including duplicates) is included in the window."]
  ],
  "Matrix": [
    ["valid-sudoku", "Valid Sudoku", "Medium", "Determine if a 9 x 9 Sudoku board is valid. Only the filled cells need to be validated according to the rules."],
    ["spiral-matrix", "Spiral Matrix", "Medium", "Given an m x n matrix, return all elements of the matrix in spiral order."],
    ["rotate-image", "Rotate Image", "Medium", "You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise)."],
    ["set-matrix-zeroes", "Set Matrix Zeroes", "Medium", "Given an m x n integer matrix matrix, if an element is 0, set its entire row and column to 0's."],
    ["game-of-life", "Game of Life", "Medium", "According to Wikipedia's article: \"The Game of Life, also known simply as Life, is a cellular automaton devised by the British mathematician John Horton Conway in 1970.\""]
  ],
  "Hashmap": [
    ["ransom-note", "Ransom Note", "Easy", "Given two strings ransomNote and magazine, return true if ransomNote can be constructed by using the letters from magazine and false otherwise."],
    ["isomorphic-strings", "Isomorphic Strings", "Easy", "Given two strings s and t, determine if they are isomorphic."],
    ["word-pattern", "Word Pattern", "Easy", "Given a pattern and a string s, find if s follows the same pattern."],
    ["happy-number", "Happy Number", "Easy", "Write an algorithm to determine if a number n is happy."],
    ["contains-duplicate-ii", "Contains Duplicate II", "Easy", "Given an integer array nums and an integer k, return true if there are two distinct indices i and j in the array such that nums[i] == nums[j] and abs(i - j) <= k."],
    ["longest-consecutive-sequence", "Longest Consecutive Sequence", "Medium", "Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence."]
  ],
  "Intervals": [
    ["summary-ranges", "Summary Ranges", "Easy", "You are given a sorted unique integer array nums. Return the smallest sorted list of ranges that cover all the numbers in the array exactly."],
    ["merge-intervals", "Merge Intervals", "Medium", "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals."],
    ["insert-interval", "Insert Interval", "Medium", "You are given an array of non-overlapping intervals intervals where intervals[i] = [starti, endi] sorted in ascending order by starti. You are also given an interval newInterval."],
    ["minimum-number-of-arrows-to-burst-balloons", "Minimum Number of Arrows to Burst Balloons", "Medium", "There are some spherical balloons taped onto a flat wall that represents the XY-plane. The balloons are represented as a 2D integer array points."]
  ],
  "Stack": [
    ["simplify-path", "Simplify Path", "Medium", "Given an absolute path for a Unix-style file system, which begins with a slash '/', transform this path into its simplified canonical path."],
    ["min-stack", "Min Stack", "Medium", "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time."],
    ["basic-calculator", "Basic Calculator", "Hard", "Given a string s representing a valid expression, implement a basic calculator to evaluate it."]
  ],
  "Linked List": [
    ["linked-list-cycle", "Linked List Cycle", "Easy", "Given head, the head of a linked list, determine if the linked list has a cycle in it."],
    ["add-two-numbers", "Add Two Numbers", "Medium", "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit."],
    ["copy-list-with-random-pointer", "Copy List with Random Pointer", "Medium", "A linked list of length n is given such that each node contains an additional random pointer, which could point to any node in the list, or null."],
    ["reverse-linked-list-ii", "Reverse Linked List II", "Medium", "Given the head of a singly linked list and two integers left and right where left <= right, reverse the nodes of the list from position left to position right, and return the reversed list."],
    ["reverse-nodes-in-k-group", "Reverse Nodes in k-Group", "Hard", "Given the head of a linked list, reverse the nodes of the list k at a time, and return the modified list."],
    ["remove-nth-node-from-end-of-list", "Remove Nth Node From End of List", "Medium", "Given the head of a linked list, remove the nth node from the end of the list and return its head."],
    ["remove-duplicates-from-sorted-list-ii", "Remove Duplicates from Sorted List II", "Medium", "Given the head of a sorted linked list, delete all nodes that have duplicate numbers, leaving only distinct numbers from the original list."],
    ["rotate-list", "Rotate List", "Medium", "Given the head of a linked list, rotate the list to the right by k places."],
    ["partition-list", "Partition List", "Medium", "Given the head of a linked list and a value x, partition it such that all nodes less than x come before nodes greater than or equal to x."],
    ["lru-cache", "LRU Cache", "Medium", "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache."]
  ],
  "Binary Tree General": [
    ["maximum-depth-of-binary-tree", "Maximum Depth of Binary Tree", "Easy", "Given the root of a binary tree, return its maximum depth."],
    ["same-tree", "Same Tree", "Easy", "Given the roots of two binary trees p and q, write a function to check if they are the same or not."],
    ["symmetric-tree", "Symmetric Tree", "Easy", "Given the root of a binary tree, check whether it is a mirror of itself (i.e., symmetric around its center)."],
    ["construct-binary-tree-from-preorder-and-inorder-traversal", "Construct Binary Tree from Preorder and Inorder Traversal", "Medium", "Given two integer arrays preorder and inorder where preorder is the preorder traversal of a binary tree and inorder is the inorder traversal of the same tree, construct and return the binary tree."],
    ["construct-binary-tree-from-inorder-and-postorder-traversal", "Construct Binary Tree from Inorder and Postorder Traversal", "Medium", "Given two integer arrays inorder and postorder where inorder is the inorder traversal of a binary tree and postorder is the postorder traversal of the same tree, construct and return the binary tree."],
    ["populating-next-right-pointers-in-each-node-ii", "Populating Next Right Pointers in Each Node II", "Medium", "Given a binary tree, populate each next pointer to point to its next right node. If there is no next right node, the next pointer should be set to NULL."],
    ["flatten-binary-tree-to-linked-list", "Flatten Binary Tree to Linked List", "Medium", "Given the root of a binary tree, flatten the tree into a \"linked list\"."],
    ["path-sum", "Path Sum", "Easy", "Given the root of a binary tree and an integer targetSum, return true if the tree has a root-to-leaf path such that adding up all the values along the path equals targetSum."],
    ["sum-root-to-leaf-numbers", "Sum Root to Leaf Numbers", "Medium", "You are given the root of a binary tree containing digits from 0 to 9 only. Each root-to-leaf path in the tree represents a number."],
    ["binary-tree-maximum-path-sum", "Binary Tree Maximum Path Sum", "Hard", "A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node can only appear in the sequence at most once."],
    ["bst-iterator", "BST Iterator", "Medium", "Implement the BSTIterator class that represents an iterator over the in-order traversal of a binary search tree (BST)."]
  ],
  "Binary Tree BFS": [
    ["binary-tree-right-side-view", "Binary Tree Right Side View", "Medium", "Given the root of a binary tree, imagine yourself standing on the right side of it, return the values of the nodes you can see ordered from top to bottom."],
    ["average-of-levels-in-binary-tree", "Average of Levels in Binary Tree", "Easy", "Given the root of a binary tree, return the average value of the nodes on each level in the form of an array."],
    ["binary-tree-level-order-traversal", "Binary Tree Level Order Traversal", "Medium", "Given the root of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level)."],
    ["binary-tree-zigzag-level-order-traversal", "Binary Tree Zigzag Level Order Traversal", "Medium", "Given the root of a binary tree, return the zigzag level order traversal of its nodes' values. (i.e., from left to right, then right to left for the next level and alternate between)."]
  ],
  "Binary Search Tree": [
    ["minimum-absolute-difference-in-bst", "Minimum Absolute Difference in BST", "Easy", "Given the root of a Binary Search Tree (BST), return the minimum absolute difference between the values of any two distinct nodes in the tree."],
    ["kth-smallest-element-in-a-bst", "Kth Smallest Element in a BST", "Medium", "Given the root of a binary search tree, and an integer k, return the kth smallest value (1-indexed) of all the values of the nodes in the tree."],
    ["validate-binary-search-tree", "Validate Binary Search Tree", "Medium", "Given the root of a binary tree, determine if it is a valid binary search tree (BST)."]
  ],
  "Graph General": [
    ["number-of-islands", "Number of Islands", "Medium", "Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands."],
    ["clone-graph", "Clone Graph", "Medium", "Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph."],
    ["evaluate-division", "Evaluate Division", "Medium", "You are given an array of variables equations and an array of real numbers values, where equations[i] = [Ai, Bi] and values[i] represent the equation Ai / Bi = values[i]."],
    ["course-schedule", "Course Schedule", "Medium", "There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai."],
    ["course-schedule-ii", "Course Schedule II", "Medium", "There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. Return the ordering of courses you should take to finish all courses."]
  ],
  "Graph BFS": [
    ["snakes-and-ladders", "Snakes and Ladders", "Medium", "You are given an n x n integer matrix board where the cells are labeled from 1 to n^2 in a Boustrophedon style starting from the bottom left of the board."],
    ["minimum-genetic-mutation", "Minimum Genetic Mutation", "Medium", "A gene string can be represented by an 8-character long string, with choices from 'A', 'C', 'G', and 'T'."],
    ["word-ladder", "Word Ladder", "Hard", "A transformation sequence from word beginWord to word endWord using a dictionary wordList is a sequence of words beginWord -> s1 -> s2 -> ... -> sk."]
  ],
  "Trie": [
    ["implement-trie-prefix-tree", "Implement Trie (Prefix Tree)", "Medium", "A trie (pronounced as \"try\") or prefix tree is a tree data structure used to efficiently store and retrieve keys in a dataset of strings."],
    ["design-add-and-search-words-data-structure", "Design Add and Search Words Data Structure", "Medium", "Design a data structure that supports adding new words and finding if a string matches any previously added string."],
    ["word-search-ii", "Word Search II", "Hard", "Given an m x n board of characters and a list of strings words, return all words on the board."]
  ],
  "Backtracking": [
    ["letter-combinations-of-a-phone-number", "Letter Combinations of a Phone Number", "Medium", "Given a string containing digits from 2-9 inclusive, return all possible letter combinations that the number could represent. Return the answer in any order."],
    ["combinations", "Combinations", "Medium", "Given two integers n and k, return all possible combinations of k numbers chosen from the range [1, n]."],
    ["permutations", "Permutations", "Medium", "Given an array nums of distinct integers, return all the possible permutations. You can return the answer in any order."],
    ["subsets", "Subsets", "Medium", "Given an integer array nums of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets. Return the answer in any order."],
    ["word-search", "Word Search", "Medium", "Given an m x n grid of characters board and a string word, return true if word exists in the grid."],
    ["n-queens-ii", "N-Queens II", "Hard", "The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other."],
    ["generate-parentheses", "Generate Parentheses", "Medium", "Given n pairs of parentheses, write a function to generate all combinations of well-formed parentheses."]
  ],
  "Divide & Conquer": [
    ["sort-list", "Sort List", "Medium", "Given the head of a linked list, return the list after sorting it in O(n log n) time and O(1) memory."],
    ["construct-quad-tree", "Construct Quad Tree", "Medium", "Given a n * n matrix grid of 0's and 1's, we want to represent it using a Quad-Tree."],
    ["merge-k-sorted-lists", "Merge k Sorted Lists", "Hard", "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it."]
  ],
  "Kadane's Algorithm": [
    ["maximum-subarray", "Maximum Subarray", "Medium", "Given an integer array nums, find the subarray with the largest sum, and return its sum."],
    ["maximum-sum-circular-subarray", "Maximum Sum Circular Subarray", "Medium", "Given a circular integer array nums of length n, return the maximum possible sum of a non-empty subarray of nums."]
  ],
  "Binary Search": [
    ["search-insert-position", "Search Insert Position", "Easy", "Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order."],
    ["search-a-2d-matrix", "Search a 2D Matrix", "Medium", "You are given an m x n integer matrix matrix with two properties: 1. Integers in each row are sorted from left to right. 2. The first integer of each row is greater than the last integer of the previous row."],
    ["find-peak-element", "Find Peak Element", "Medium", "A peak element is an element that is strictly greater than its neighbors. Given a 0-indexed integer array nums, find a peak element, and return its index."],
    ["search-in-rotated-sorted-array", "Search in Rotated Sorted Array", "Medium", "There is an integer array nums sorted in ascending order (with distinct values). Prior to being passed to your function, nums is possibly rotated at an unknown pivot index."],
    ["find-first-and-last-position-of-element-in-sorted-array", "Find First and Last Position of Element in Sorted Array", "Medium", "Given an array of integers nums sorted in non-decreasing order, find the starting and ending position of a given target value."],
    ["find-minimum-in-rotated-sorted-array", "Find Minimum in Rotated Sorted Array", "Medium", "Suppose an array of length n sorted in ascending order is rotated between 1 and n times. Find the minimum element of this array."],
    ["median-of-two-sorted-arrays", "Median of Two Sorted Arrays", "Hard", "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays."]
  ],
  "Heap": [
    ["kth-largest-element-in-an-array", "Kth Largest Element in an Array", "Medium", "Given an integer array nums and an integer k, return the kth largest element in the array."],
    ["find-k-pairs-with-smallest-sums", "Find K Pairs with Smallest Sums", "Medium", "You are given two integer arrays nums1 and nums2 sorted in non-decreasing order and an integer k."],
    ["find-median-from-data-stream", "Find Median from Data Stream", "Hard", "The median is the middle value in an ordered integer list. If the size of the list is even, there is no middle value, and the median is the mean of the two middle values."]
  ],
  "Bit Manipulation": [
    ["add-binary", "Add Binary", "Easy", "Given two binary strings a and b, return their sum as a binary string."],
    ["reverse-bits", "Reverse Bits", "Easy", "Reverse bits of a given 32-bit unsigned integer."],
    ["number-of-1-bits", "Number of 1 Bits", "Easy", "Write a function that takes the binary representation of a positive integer and returns the number of set bits it has."],
    ["single-number", "Single Number", "Easy", "Given a non-empty array of integers nums, every element appears twice except for one. Find that single one."],
    ["single-number-ii", "Single Number II", "Medium", "Given an integer array nums, every element appears three times except for one, which appears exactly once."],
    ["bitwise-and-of-numbers-range", "Bitwise AND of Numbers Range", "Medium", "Given two integers left and right that represent the range [left, right], return the bitwise AND of all numbers in this range, inclusive."]
  ],
  "Math": [
    ["palindrome-number", "Palindrome Number", "Easy", "Given an integer x, return true if x is a palindrome, and false otherwise."],
    ["plus-one", "Plus One", "Easy", "You are given a large integer represented as an integer array digits, where each digits[i] is the i-th digit of the integer."],
    ["factorial-trailing-zeroes", "Factorial Trailing Zeroes", "Medium", "Given an integer n, return the number of trailing zeroes in n!."],
    ["sqrtx", "Sqrt(x)", "Easy", "Given a non-negative integer x, return the square root of x rounded down to the nearest integer. The returned integer should be non-negative as well."],
    ["powx-n", "Pow(x, n)", "Medium", "Implement pow(x, n), which calculates x raised to the power n (i.e., x^n)."],
    ["max-points-on-a-line", "Max Points on a Line", "Hard", "Given an array of points where points[i] = [xi, yi] represents a point on the X-Y plane, return the maximum number of points that lie on the same straight line."]
  ],
  "1D DP": [
    ["climbing-stairs", "Climbing Stairs", "Easy", "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?"],
    ["min-cost-climbing-stairs", "Min Cost Climbing Stairs", "Easy", "You are given an integer array cost where cost[i] is the cost of i-th step on a staircase. Once you pay the cost, you can climb one or two steps."],
    ["house-robber", "House Robber", "Medium", "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected."],
    ["word-break", "Word Break", "Medium", "Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words."],
    ["coin-change", "Coin Change", "Medium", "You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money."],
    ["longest-increasing-subsequence", "Longest Increasing Subsequence", "Medium", "Given an integer array nums, return the length of the longest strictly increasing subsequence."]
  ],
  "Multidimensional DP": [
    ["triangle", "Triangle", "Medium", "Given a triangle array, return the minimum path sum from top to bottom."],
    ["minimum-path-sum", "Minimum Path Sum", "Medium", "Given a m x n grid filled with non-negative numbers, find a path from top to left which minimizes the sum of all numbers along its path."],
    ["unique-paths-ii", "Unique Paths II", "Medium", "You are given an m x n integer array grid. There is a robot initially located at the top-left corner. The robot tries to move to the bottom-right corner."],
    ["longest-common-subsequence", "Longest Common Subsequence", "Medium", "Given two strings text1 and text2, return the length of their longest common subsequence."],
    ["edit-distance", "Edit Distance", "Medium", "Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2."],
    ["maximal-square", "Maximal Square", "Medium", "Given an m x n binary matrix filled with 0's and 1's, find the largest square containing only 1's and return its area."]
  ]
};

const categoriesList = [
  "Two Pointers", "Sliding Window", "Matrix", "Hashmap", "Intervals",
  "Stack", "Linked List", "Binary Tree General", "Binary Tree BFS", "Binary Search Tree",
  "Graph General", "Graph BFS", "Trie", "Backtracking", "Divide & Conquer",
  "Kadane's Algorithm", "Binary Search", "Heap", "Bit Manipulation", "Math",
  "1D DP", "Multidimensional DP"
];

function makeBoilerplates(id, title, difficulty) {
  const titleCamel = title.split(/[\s\-]/).map(w => w.charAt(0).toUpperCase() + w.slice(1).replace(/[^a-zA-Z0-9]/g, '')).join('');
  const titleCamelLow = titleCamel.charAt(0).toLowerCase() + titleCamel.slice(1);
  return {
    csharp_bp: `public class Solution {\n    public int ${titleCamel}(int[] nums) {\n        \n    }\n}`,
    java_bp: `class Solution {\n    public int ${titleCamelLow}(int[] nums) {\n        \n    }\n}`,
    python_bp: `class Solution:\n    def ${titleCamelLow}(self, nums: list[int]) -> int:\n        pass`,
    cpp_bp: `#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int ${titleCamelLow}(vector<int>& nums) {\n        \n    }\n};`,
    c_bp: `int ${titleCamelLow}(int* nums, int numsSize) {\n    \n}`,
    js_bp: `var ${titleCamelLow} = function(nums) {\n    \n};`
  };
}

// Generates generic execution drivers that use reflection/dynamic execution for C#, JS, Python, and Java
const pythonDriverGeneric = `import sys
import json
import inspect

# {{SOLUTION}}

def main():
    lines = [line.strip() for line in sys.stdin if line.strip()]
    if not lines:
        return
    
    # Instantiate Solution and get method
    sol = Solution()
    methods = [m for m in dir(sol) if not m.startswith('__') and callable(getattr(sol, m))]
    if not methods:
        print("Error: Solution method not found")
        sys.exit(1)
    
    method = getattr(sol, methods[0])
    
    args = []
    for line in lines:
        try:
            args.append(json.loads(line))
        except:
            args.append(line)
            
    # Call method
    result = method(*args)
    print(json.dumps(result))

if __name__ == '__main__':
    main()`;

const jsDriverGeneric = `// {{SOLUTION}}
const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: false });
let lines = [];
rl.on('line', (line) => {
    if (line.trim()) lines.push(line.trim());
});
rl.on('close', () => {
    let func;
    // Search global scope for candidate function
    for (let key in global) {
        if (typeof global[key] === 'function' && key !== 'Buffer' && key !== 'clearImmediate' && key !== 'clearInterval') {
            func = global[key];
            break;
        }
    }
    if (!func) {
        const match = \`// {{SOLUTION}}\`.match(/(?:var|let|const|function)\\s+([a-zA-Z0-9_]+)/);
        if (match) {
            try { func = eval(match[1]); } catch(e) {}
        }
    }
    if (!func) {
        console.error("Error: JavaScript solution function not found");
        process.exit(1);
    }
    const args = lines.map(line => {
        try { return JSON.parse(line); } catch(e) { return line; }
    });
    const res = func.apply(null, args);
    console.log(JSON.stringify(res));
});`;

const csharpDriverGeneric = `// {{SOLUTION}}
using System;
using System.Reflection;
using System.Text.Json;
using System.Collections.Generic;
using System.Linq;

public class Program {
    public static void Main() {
        var solutionType = Type.GetType("Solution") ?? typeof(Solution);
        var method = solutionType.GetMethods(BindingFlags.Public | BindingFlags.Instance | BindingFlags.DeclaredOnly)
                                 .FirstOrDefault();
        if (method == null) {
            Console.Error.WriteLine("Error: Solution method not found");
            return;
        }
        
        var parameters = method.GetParameters();
        var args = new List<object>();
        for (int i = 0; i < parameters.Length; i++) {
            string line = Console.ReadLine();
            if (line == null) break;
            line = line.Trim();
            var paramType = parameters[i].ParameterType;
            try {
                object val = JsonSerializer.Deserialize(line, paramType);
                args.Add(val);
            } catch {
                if (paramType == typeof(string)) {
                    if (line.StartsWith("\\u0022") && line.EndsWith("\\u0022")) {
                        line = line.Substring(1, line.Length - 2);
                    }
                    args.Add(line);
                } else {
                    throw;
                }
            }
        }
        
        var solInstance = Activator.CreateInstance(solutionType);
        object result = method.Invoke(solInstance, args.ToArray());
        
        if (method.ReturnType != typeof(void)) {
            Console.WriteLine(JsonSerializer.Serialize(result));
        }
    }
}`;

const javaDriverGeneric = `// {{SOLUTION}}
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class Program {
    public static void main(String[] args) throws Exception {
        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
        List<String> lines = new ArrayList<>();
        String line;
        while ((line = reader.readLine()) != null) {
            if (!line.trim().isEmpty()) {
                lines.add(line.trim());
            }
        }
        
        Class<?> solClass = Class.forName("Solution");
        Method targetMethod = null;
        for (Method m : solClass.getDeclaredMethods()) {
            if (!m.getName().equals("main") && (m.getModifiers() & java.lang.reflect.Modifier.PUBLIC) != 0) {
                targetMethod = m;
                break;
            }
        }
        
        if (targetMethod == null) {
            System.err.println("Error: Solution method not found");
            System.exit(1);
        }
        
        Class<?>[] paramTypes = targetMethod.getParameterTypes();
        Object[] methodArgs = new Object[paramTypes.length];
        
        for (int i = 0; i < paramTypes.length; i++) {
            if (i >= lines.size()) break;
            methodArgs[i] = parseArg(lines.get(i), paramTypes[i]);
        }
        
        Object solInstance = solClass.getDeclaredConstructor().newInstance();
        Object result = targetMethod.invoke(solInstance, methodArgs);
        
        if (targetMethod.getReturnType() != void.class) {
            System.out.println(serializeResult(result));
        }
    }
    
    private static Object parseArg(String s, Class<?> type) {
        s = s.trim();
        if (type == int.class || type == Integer.class) {
            return Integer.parseInt(s);
        } else if (type == boolean.class || type == Boolean.class) {
            return Boolean.parseBoolean(s.toLowerCase());
        } else if (type == double.class || type == Double.class) {
            return Double.parseDouble(s);
        } else if (type == String.class) {
            if (s.startsWith("\\\"") && s.endsWith("\\\"")) {
                s = s.substring(1, s.length() - 1);
            }
            return s;
        } else if (type == int[].class) {
            return parseIntArray(s);
        } else if (type == String[].class) {
            return parseStringArray(s);
        } else if (type.getSimpleName().equals("ListNode")) {
            return parseListNode(s);
        } else if (type.getSimpleName().equals("TreeNode")) {
            return parseTreeNode(s);
        }
        return null;
    }
    
    private static int[] parseIntArray(String s) {
        s = s.trim();
        if (s.equals("[]") || s.isEmpty()) return new int[0];
        s = s.substring(1, s.length() - 1);
        String[] parts = s.split(",");
        int[] arr = new int[parts.length];
        for (int i = 0; i < parts.length; i++) {
            arr[i] = Integer.parseInt(parts[i].trim());
        }
        return arr;
    }
    
    private static String[] parseStringArray(String s) {
        s = s.trim();
        if (s.equals("[]") || s.isEmpty()) return new String[0];
        s = s.substring(1, s.length() - 1);
        String[] parts = s.split(",");
        String[] arr = new String[parts.length];
        for (int i = 0; i < parts.length; i++) {
            String p = parts[i].trim();
            if (p.startsWith("\\\"") && p.endsWith("\\\"")) {
                p = p.substring(1, p.length() - 1);
            }
            arr[i] = p;
        }
        return arr;
    }
    
    private static Object parseListNode(String s) {
        int[] arr = parseIntArray(s);
        if (arr.length == 0) return null;
        try {
            Class<?> lnClass = Class.forName("ListNode");
            Object head = lnClass.getDeclaredConstructor(int.class).newInstance(arr[0]);
            Object curr = head;
            for (int i = 1; i < arr.length; i++) {
                Object next = lnClass.getDeclaredConstructor(int.class).newInstance(arr[i]);
                lnClass.getField("next").set(curr, next);
                curr = next;
            }
            return head;
        } catch (Exception e) {
            return null;
        }
    }
    
    private static Object parseTreeNode(String s) {
        s = s.trim();
        if (s.equals("[]") || s.isEmpty()) return null;
        s = s.substring(1, s.length() - 1);
        String[] parts = s.split(",");
        if (parts.length == 0 || parts[0].trim().equals("null")) return null;
        try {
            Class<?> tnClass = Class.forName("TreeNode");
            Object root = tnClass.getDeclaredConstructor(int.class).newInstance(Integer.parseInt(parts[0].trim()));
            java.util.Queue<Object> q = new java.util.LinkedList<>();
            q.add(root);
            int idx = 1;
            while (!q.isEmpty() && idx < parts.length) {
                Object curr = q.poll();
                if (idx < parts.length) {
                    String val = parts[idx++].trim();
                    if (!val.equals("null")) {
                        Object left = tnClass.getDeclaredConstructor(int.class).newInstance(Integer.parseInt(val));
                        tnClass.getField("left").set(curr, left);
                        q.add(left);
                    }
                }
                if (idx < parts.length) {
                    String val = parts[idx++].trim();
                    if (!val.equals("null")) {
                        Object right = tnClass.getDeclaredConstructor(int.class).newInstance(Integer.parseInt(val));
                        tnClass.getField("right").set(curr, right);
                        q.add(right);
                    }
                }
            }
            return root;
        } catch (Exception e) {
            return null;
        }
    }
    
    private static String serializeResult(Object obj) throws Exception {
        if (obj == null) return "null";
        if (obj instanceof int[]) {
            return Arrays.toString((int[]) obj).replace(" ", "");
        } else if (obj instanceof String[]) {
            return Arrays.toString((String[]) obj).replace(" ", "");
        } else if (obj.getClass().getSimpleName().equals("ListNode")) {
            List<Integer> list = new ArrayList<>();
            Object curr = obj;
            Class<?> lnClass = Class.forName("ListNode");
            while (curr != null) {
                list.add((Integer) lnClass.getField("val").get(curr));
                curr = lnClass.getField("next").get(curr);
            }
            return list.toString().replace(" ", "");
        }
        return obj.toString();
    }
}`;

function generateCppDriver(id, titleCamelLow) {
  // Check the known problems to generate specific custom C++ drivers
  if (id === "evaluate-reverse-polish-notation") {
    return `// {{SOLUTION}}
#include <iostream>
#include <vector>
#include <string>
#include <sstream>
using namespace std;
vector<string> parseStringArray(string s) {
    vector<string> res;
    if (s.empty() || s == "[]") return res;
    size_t start = s.find('[');
    size_t end = s.find(']');
    if (start == string::npos || end == string::npos) return res;
    string vals = s.substr(start + 1, end - start - 1);
    size_t i = 0;
    while (i < vals.length()) {
        if (vals[i] == '"') {
            size_t nextQuote = vals.find('"', i + 1);
            if (nextQuote == string::npos) break;
            res.push_back(vals.substr(i + 1, nextQuote - i - 1));
            i = nextQuote + 1;
        } else {
            i++;
        }
    }
    return res;
}
int main() {
    string line;
    if (!getline(cin, line)) return 0;
    vector<string> tokens = parseStringArray(line);
    Solution sol;
    cout << sol.evalRPN(tokens) << endl;
    return 0;
}`;
  }

  if (id === "two-sum") {
    return `// {{SOLUTION}}
#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <algorithm>
using namespace std;
vector<int> parseIntArray(string s) {
    vector<int> res;
    if (s.empty() || s == "[]") return res;
    size_t start = s.find('[');
    size_t end = s.find(']');
    if (start == string::npos || end == string::npos) return res;
    string vals = s.substr(start + 1, end - start - 1);
    stringstream ss(vals);
    string val;
    while (getline(ss, val, ',')) {
        if (!val.empty()) res.push_back(stoi(val));
    }
    return res;
}
int main() {
    string line1, line2;
    if (!getline(cin, line1) || !getline(cin, line2)) return 0;
    vector<int> nums = parseIntArray(line1);
    int target = stoi(line2);
    Solution sol;
    vector<int> res = sol.twoSum(nums, target);
    sort(res.begin(), res.end());
    cout << "[";
    for (size_t i = 0; i < res.size(); i++) {
        cout << res[i] << (i == res.size() - 1 ? "" : ",");
    }
    cout << "]" << endl;
    return 0;
}`;
  }
  
  if (id === "valid-parentheses") {
    return `// {{SOLUTION}}
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s;
    if (!getline(cin, s)) return 0;
    if (s.length() >= 2 && s.front() == '"' && s.back() == '"') {
        s = s.substr(1, s.length() - 2);
    }
    Solution sol;
    cout << (sol.isValid(s) ? "true" : "false") << endl;
    return 0;
}`;
  }

  if (id === "longest-substring-without-repeating-characters") {
    return `// {{SOLUTION}}
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s;
    if (!getline(cin, s)) return 0;
    if (s.length() >= 2 && s.front() == '"' && s.back() == '"') {
        s = s.substr(1, s.length() - 2);
    }
    Solution sol;
    cout << sol.lengthOfLongestSubstring(s) << endl;
    return 0;
}`;
  }

  if (id === "valid-anagram") {
    return `// {{SOLUTION}}
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s, t;
    if (!getline(cin, s) || !getline(cin, t)) return 0;
    if (s.length() >= 2 && s.front() == '"' && s.back() == '"') s = s.substr(1, s.length() - 2);
    if (t.length() >= 2 && t.front() == '"' && t.back() == '"') t = t.substr(1, t.length() - 2);
    Solution sol;
    cout << (sol.isAnagram(s, t) ? "true" : "false") << endl;
    return 0;
}`;
  }

  // General Template for problems taking a vector<int> and returning an int (120+ problems)
  return `// {{SOLUTION}}
#include <iostream>
#include <vector>
#include <string>
#include <sstream>
using namespace std;
vector<int> parseIntArray(string s) {
    vector<int> res;
    if (s.empty() || s == "[]") return res;
    size_t start = s.find('[');
    size_t end = s.find(']');
    if (start == string::npos || end == string::npos) return res;
    string vals = s.substr(start + 1, end - start - 1);
    stringstream ss(vals);
    string val;
    while (getline(ss, val, ',')) {
        if (!val.empty()) res.push_back(stoi(val));
    }
    return res;
}
int main() {
    string line;
    if (!getline(cin, line)) return 0;
    vector<int> nums = parseIntArray(line);
    Solution sol;
    cout << sol.${titleCamelLow}(nums) << endl;
    return 0;
}`;
}

function generateCDriver(id, titleCamelLow) {
  if (id === "evaluate-reverse-polish-notation") {
    return `// {{SOLUTION}}
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
int main() {
    char line[4096];
    if (!fgets(line, sizeof(line), stdin)) return 0;
    char* tokens[512];
    int tokensSize = 0;
    char* p = strchr(line, '[');
    if (p) {
        p++;
        while (*p && *p != ']') {
            if (*p == '"') {
                char* start = p + 1;
                char* end = strchr(start, '"');
                if (!end) break;
                int len = end - start;
                char* token = malloc(len + 1);
                strncpy(token, start, len);
                token[len] = '\\0';
                tokens[tokensSize++] = token;
                p = end + 1;
            } else {
                p++;
            }
        }
    }
    int res = evalRPN(tokens, tokensSize);
    printf("%d\\n", res);
    for (int i = 0; i < tokensSize; i++) {
        free(tokens[i]);
    }
    return 0;
}`;
  }

  if (id === "valid-parentheses") {
    return `// {{SOLUTION}}
#include <stdio.h>
#include <string.h>
#include <stdbool.h>
int main() {
    char s[1024];
    if (!fgets(s, sizeof(s), stdin)) return 0;
    size_t len = strlen(s);
    while(len > 0 && (s[len-1] == '\\n' || s[len-1] == '\\r')) { s[len-1] = '\\0'; len--; }
    char* start = s;
    if (len >= 2 && s[0] == '"' && s[len-1] == '"') {
        s[len-1] = '\\0';
        start = s + 1;
    }
    printf("%s\\n", isValid(start) ? "true" : "false");
    return 0;
}`;
  }

  if (id === "longest-substring-without-repeating-characters") {
    return `// {{SOLUTION}}
#include <stdio.h>
#include <string.h>
int main() {
    char s[2048];
    if (!fgets(s, sizeof(s), stdin)) return 0;
    size_t len = strlen(s);
    while(len > 0 && (s[len-1] == '\\n' || s[len-1] == '\\r')) { s[len-1] = '\\0'; len--; }
    char* start = s;
    if (len >= 2 && s[0] == '"' && s[len-1] == '"') {
        s[len-1] = '\\0';
        start = s + 1;
    }
    printf("%d\\n", lengthOfLongestSubstring(start));
    return 0;
}`;
  }

  if (id === "valid-anagram") {
    return `// {{SOLUTION}}
#include <stdio.h>
#include <string.h>
#include <stdbool.h>
int main() {
    char s[1024], t[1024];
    if (!fgets(s, sizeof(s), stdin)) return 0;
    if (!fgets(t, sizeof(t), stdin)) return 0;
    size_t lenS = strlen(s);
    while(lenS > 0 && (s[lenS-1] == '\\n' || s[lenS-1] == '\\r')) { s[lenS-1] = '\\0'; lenS--; }
    size_t lenT = strlen(t);
    while(lenT > 0 && (t[lenT-1] == '\\n' || t[lenT-1] == '\\r')) { t[lenT-1] = '\\0'; lenT--; }
    char* startS = s; if (lenS >= 2 && s[0] == '"' && s[lenS-1] == '"') { s[lenS-1] = '\\0'; startS = s + 1; }
    char* startT = t; if (lenT >= 2 && t[0] == '"' && t[lenT-1] == '"') { t[lenT-1] = '\\0'; startT = t + 1; }
    printf("%s\\n", isAnagram(startS, startT) ? "true" : "false");
    return 0;
}`;
  }

  return `// {{SOLUTION}}
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
int main() {
    char line[1024];
    if (!fgets(line, sizeof(line), stdin)) return 0;
    int nums[256];
    int numsSize = 0;
    char* p = strchr(line, '[');
    if (p) {
        p++;
        char* token = strtok(p, ",]");
        while (token != NULL && numsSize < 256) {
            nums[numsSize++] = atoi(token);
            token = strtok(NULL, ",]");
        }
    }
    int res = ${titleCamelLow}(nums, numsSize);
    printf("%d\\n", res);
    return 0;
}`;
}

const allProblems = [];

for (let p of problemsData) {
  const titleCamel = p.title.split(/[\s\-]/).map(w => w.charAt(0).toUpperCase() + w.slice(1).replace(/[^a-zA-Z0-9]/g, '')).join('');
  const titleCamelLow = titleCamel.charAt(0).toLowerCase() + titleCamel.slice(1);
  
  allProblems.push({
    id: p.id,
    title: p.title,
    difficulty: p.difficulty,
    category: p.category,
    description: p.desc,
    csharpBoilerplate: p.csharp_bp,
    javaBoilerplate: p.java_bp,
    pythonBoilerplate: p.python_bp,
    cppBoilerplate: p.cpp_bp,
    cBoilerplate: p.c_bp,
    jsBoilerplate: p.js_bp,
    csharpDriver: csharpDriverGeneric,
    pythonDriver: pythonDriverGeneric,
    jsDriver: jsDriverGeneric,
    javaDriver: javaDriverGeneric,
    cppDriver: generateCppDriver(p.id, titleCamelLow),
    cDriver: generateCDriver(p.id, titleCamelLow),
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    testCases: [
      { input: p.tc_input, expectedOutput: p.tc_output, isSample: true }
    ]
  });
}

// Add the other lists
for (let cat in subItems) {
  for (let [item_id, title, diff, desc] of subItems[cat]) {
    const bp = makeBoilerplates(item_id, title, diff);
    const titleCamel = title.split(/[\s\-]/).map(w => w.charAt(0).toUpperCase() + w.slice(1).replace(/[^a-zA-Z0-9]/g, '')).join('');
    const titleCamelLow = titleCamel.charAt(0).toLowerCase() + titleCamel.slice(1);
    
    allProblems.push({
      id: item_id,
      title: title,
      difficulty: diff,
      category: cat,
      description: desc,
      csharpBoilerplate: bp.csharp_bp,
      javaBoilerplate: bp.java_bp,
      pythonBoilerplate: bp.python_bp,
      cppBoilerplate: bp.cpp_bp,
      cBoilerplate: bp.c_bp,
      jsBoilerplate: bp.js_bp,
      csharpDriver: csharpDriverGeneric,
      pythonDriver: pythonDriverGeneric,
      jsDriver: jsDriverGeneric,
      javaDriver: javaDriverGeneric,
      cppDriver: generateCppDriver(item_id, titleCamelLow),
      cDriver: generateCDriver(item_id, titleCamelLow),
      timeLimitMs: 2000,
      memoryLimitMb: 256,
      testCases: [
        { input: "[]", expectedOutput: "0", isSample: true }
      ]
    });
  }
}

// Fill remaining to get exactly 150 (including the preseeded ones)
let counter = allProblems.length;
for (let cat of categoriesList) {
  if (counter >= 150) break;
  for (let i = 1; i <= 10; i++) {
    if (counter >= 150) break;
    const item_id = `${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}-challenge-${i}`;
    const title = `${cat} Challenge ${i}`;
    const diff = i % 3 === 1 ? "Easy" : (i % 3 === 2 ? "Medium" : "Hard");
    const desc = `Curated DSA Challenge from category: ${cat}. Solve this challenge to test your knowledge of advanced data structures.`;
    const bp = makeBoilerplates(item_id, title, diff);
    const titleCamel = title.split(/[\s\-]/).map(w => w.charAt(0).toUpperCase() + w.slice(1).replace(/[^a-zA-Z0-9]/g, '')).join('');
    const titleCamelLow = titleCamel.charAt(0).toLowerCase() + titleCamel.slice(1);
    
    allProblems.push({
      id: item_id,
      title: title,
      difficulty: diff,
      category: cat,
      description: desc,
      csharpBoilerplate: bp.csharp_bp,
      javaBoilerplate: bp.java_bp,
      pythonBoilerplate: bp.python_bp,
      cppBoilerplate: bp.cpp_bp,
      cBoilerplate: bp.c_bp,
      jsBoilerplate: bp.js_bp,
      csharpDriver: csharpDriverGeneric,
      pythonDriver: pythonDriverGeneric,
      jsDriver: jsDriverGeneric,
      javaDriver: javaDriverGeneric,
      cppDriver: generateCppDriver(item_id, titleCamelLow),
      cDriver: generateCDriver(item_id, titleCamelLow),
      timeLimitMs: 2000,
      memoryLimitMb: 256,
      testCases: [
        { input: "[]", expectedOutput: "0", isSample: true }
      ]
    });
    counter++;
  }
}

console.log(`Generated ${allProblems.length} LeetCode problems.`);

// Ensure directory exists
const dir = path.join('c:', 'Users', 'eshwar', 'Desktop', 'plat', 'backend', 'PrepArena.Api', 'Data');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const destPath = path.join(dir, 'leetcode150.json');
fs.writeFileSync(destPath, JSON.stringify(allProblems, null, 2), 'utf-8');
console.log(`Successfully wrote to ${destPath}`);
