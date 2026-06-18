using Microsoft.EntityFrameworkCore;
using PrepArena.Api.Models;
using PrepArena.Api.Services;
using System.Collections.Generic;

namespace PrepArena.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Problem> Problems => Set<Problem>();
        public DbSet<TestCase> TestCases => Set<TestCase>();
        public DbSet<Submission> Submissions => Set<Submission>();
        public DbSet<InterviewQuestion> InterviewQuestions => Set<InterviewQuestion>();
        public DbSet<InterviewSession> InterviewSessions => Set<InterviewSession>();
        public DbSet<User> Users => Set<User>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Seed Users
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Email = "admin@preparena.dev",
                    Name = "System Admin",
                    PasswordHash = PasswordHasher.HashPassword("admin123"),
                    Role = "Admin"
                },
                new User
                {
                    Email = "student@preparena.dev",
                    Name = "Alex Coder",
                    PasswordHash = PasswordHasher.HashPassword("student123"),
                    Role = "Student"
                }
            );

            // Seed Problems
            var twoSum = new Problem
            {
                Id = "two-sum",
                Title = "Two Sum",
                Difficulty = "Easy",
                Category = "Arrays & Hashing",
                Description = @"Given an array of integers `nums` and an integer `target`, return *indices of the two numbers such that they add up to `target`*.

You may assume that each input would have ***exactly* one solution**, and you may not use the *same* element twice.

You can return the answer in any order.

### Example 1:
**Input:** `nums = [2,7,11,15], target = 9`  
**Output:** `[0,1]`  
**Explanation:** Because `nums[0] + nums[1] == 9`, we return `[0, 1]`.",
                CsharpBoilerplate = @"public class Solution {
    public int[] TwoSum(int[] nums, int target) {
        
    }
}",
                JavaBoilerplate = @"class Solution {
    public int[] twoSum(int[] nums, int target) {
        
    }
}",
                PythonBoilerplate = @"class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        pass",
                CppBoilerplate = @"#include <vector>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        
    }
};",
                CBoilerplate = @"int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
    
}",
                JsBoilerplate = @"var twoSum = function(nums, target) {
    
};",
                CsharpDriver = @"// {{SOLUTION}}
using System;
using System.Text.Json;
using System.Linq;

public class Program {
    public static void Main() {
        string line1 = Console.ReadLine();
        string line2 = Console.ReadLine();
        int[] nums = JsonSerializer.Deserialize<int[]>(line1);
        int target = int.Parse(line2);
        
        var sol = new Solution();
        int[] result = sol.TwoSum(nums, target);
        Array.Sort(result);
        Console.WriteLine(JsonSerializer.Serialize(result));
    }
}",
                JsDriver = @"// {{SOLUTION}}
const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: false });
let lines = [];
rl.on('line', (line) => lines.push(line));
rl.on('close', () => {
    if (lines.length < 2) return;
    const nums = JSON.parse(lines[0]);
    const target = parseInt(lines[1], 10);
    const res = twoSum(nums, target);
    res.sort((a,b) => a - b);
    console.log(JSON.stringify(res));
});",
                VideoUrl = "https://www.youtube.com/watch?v=KLlXCFG5Tk0"
            };

            var validParentheses = new Problem
            {
                Id = "valid-parentheses",
                Title = "Valid Parentheses",
                Difficulty = "Easy",
                Category = "Stacks",
                Description = @"Given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.

### Example 1:
**Input:** `s = ""()""`  
**Output:** `true`",
                CsharpBoilerplate = @"public class Solution {
    public bool IsValid(string s) {
        
    }
}",
                JavaBoilerplate = @"class Solution {
    public boolean isValid(String s) {
        
    }
}",
                PythonBoilerplate = @"class Solution:
    def isValid(self, s: str) -> bool:
        pass",
                CppBoilerplate = @"#include <string>
using namespace std;

class Solution {
public:
    bool isValid(string s) {
        
    }
};",
                CBoilerplate = @"#include <stdbool.h>
bool isValid(char* s) {
    
}",
                JsBoilerplate = @"var isValid = function(s) {
    
};",
                CsharpDriver = @"// {{SOLUTION}}
using System;

public class Program {
    public static void Main() {
        string s = Console.ReadLine()?.Trim() ?? """";
        if (s.StartsWith(""\u0022"") && s.EndsWith(""\u0022"")) {
            s = s.Substring(1, s.Length - 2);
        }
        var sol = new Solution();
        Console.WriteLine(sol.IsValid(s).ToString().ToLower());
    }
}",
                JsDriver = @"// {{SOLUTION}}
const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: false });
rl.on('line', (line) => {
    let s = line.trim();
    if (s.startsWith('""') && s.endsWith('""')) {
        s = s.substring(1, s.length - 1);
    }
    console.log(isValid(s).toString());
});",
                VideoUrl = "https://www.youtube.com/watch?v=WTzjTcl9u9w"
            };

            var stock = new Problem
            {
                Id = "best-time-to-buy-and-sell-stock",
                Title = "Best Time to Buy and Sell Stock",
                Difficulty = "Easy",
                Category = "Sliding Window",
                Description = @"You are given an array `prices` where `prices[i]` is the price of a given stock on the `i-th` day.

You want to maximize your profit by choosing a **single day** to buy one stock and choosing a **different day in the future** to sell that stock.

Return *the maximum profit you can achieve from this transaction*. If you cannot achieve any profit, return `0`.",
                CsharpBoilerplate = @"public class Solution {
    public int MaxProfit(int[] prices) {
        
    }
}",
                JavaBoilerplate = @"class Solution {
    public int maxProfit(int[] prices) {
        
    }
}",
                PythonBoilerplate = @"class Solution:
    def maxProfit(self, prices: list[int]) -> int:
        pass",
                CppBoilerplate = @"#include <vector>
using namespace std;

class Solution {
public:
    int maxProfit(vector<int>& prices) {
        
    }
};",
                CBoilerplate = @"int maxProfit(int* prices, int pricesSize) {
    
}",
                JsBoilerplate = @"var maxProfit = function(prices) {
    
};",
                CsharpDriver = @"// {{SOLUTION}}
using System;
using System.Text.Json;

public class Program {
    public static void Main() {
        string line = Console.ReadLine();
        int[] prices = JsonSerializer.Deserialize<int[]>(line);
        var sol = new Solution();
        Console.WriteLine(sol.MaxProfit(prices));
    }
}",
                JsDriver = @"// {{SOLUTION}}
const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: false });
rl.on('line', (line) => {
    const prices = JSON.parse(line.trim());
    console.log(maxProfit(prices));
});",
                VideoUrl = "https://www.youtube.com/watch?v=1pkOgXD63yU"
            };

            var binarySearch = new Problem
            {
                Id = "binary-search",
                Title = "Binary Search",
                Difficulty = "Easy",
                Category = "Binary Search",
                Description = @"Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return `-1`.

You must write an algorithm with `O(log n)` runtime complexity.",
                CsharpBoilerplate = @"public class Solution {
    public int Search(int[] nums, int target) {
        
    }
}",
                JavaBoilerplate = @"class Solution {
    public int search(int[] nums, int target) {
        
    }
}",
                PythonBoilerplate = @"class Solution:
    def search(self, nums: list[int], target: int) -> int:
        pass",
                CppBoilerplate = @"#include <vector>
using namespace std;
class Solution {
public:
    int search(vector<int>& nums, int target) {
        
    }
};",
                CBoilerplate = @"int search(int* nums, int numsSize, int target) {
    
}",
                JsBoilerplate = @"var search = function(nums, target) {
    
};",
                CsharpDriver = @"// {{SOLUTION}}
using System;
using System.Text.Json;

public class Program {
    public static void Main() {
        string line1 = Console.ReadLine();
        string line2 = Console.ReadLine();
        int[] nums = JsonSerializer.Deserialize<int[]>(line1);
        int target = int.Parse(line2);
        var sol = new Solution();
        Console.WriteLine(sol.Search(nums, target));
    }
}",
                JsDriver = @"// {{SOLUTION}}
const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: false });
let lines = [];
rl.on('line', (line) => lines.push(line));
rl.on('close', () => {
    const nums = JSON.parse(lines[0]);
    const target = parseInt(lines[1]);
    console.log(search(nums, target));
});",
                VideoUrl = "https://www.youtube.com/watch?v=s4DPM8ct1EH"
            };

            var reverseList = new Problem
            {
                Id = "reverse-linked-list",
                Title = "Reverse Linked List",
                Difficulty = "Easy",
                Category = "Linked List",
                Description = @"Given the `head` of a singly linked list, reverse the list, and return *the reversed list*.",
                CsharpBoilerplate = @"public class ListNode {
    public int val;
    public ListNode next;
    public ListNode(int val=0, ListNode next=null) {
        this.val = val;
        this.next = next;
    }
}

public class Solution {
    public ListNode ReverseList(ListNode head) {
        
    }
}",
                JavaBoilerplate = @"class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
}
class Solution {
    public ListNode reverseList(ListNode head) {
        
    }
}",
                PythonBoilerplate = @"class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
class Solution:
    def reverseList(self, head: ListNode) -> ListNode:
        pass",
                CppBoilerplate = @"struct ListNode {
    int val;
    ListNode *next;
    ListNode(int x) : val(x), next(nullptr) {}
};
class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        
    }
};",
                CBoilerplate = @"struct ListNode {
    int val;
    struct ListNode *next;
};
struct ListNode* reverseList(struct ListNode* head) {
    
}",
                JsBoilerplate = @"function ListNode(val, next) {
    this.val = (val===undefined ? 0 : val)
    this.next = (next===undefined ? null : next)
}
var reverseList = function(head) {
    
};",
                CsharpDriver = @"// {{SOLUTION}}
using System;
using System.Collections.Generic;
using System.Text.Json;

public class Program {
    public static void Main() {
        string line = Console.ReadLine();
        int[] vals = JsonSerializer.Deserialize<int[]>(line);
        ListNode head = null;
        ListNode tail = null;
        foreach (var v in vals) {
            var node = new ListNode(v);
            if (head == null) { head = node; tail = node; }
            else { tail.next = node; tail = node; }
        }
        var sol = new Solution();
        ListNode rev = sol.ReverseList(head);
        List<int> res = new List<int>();
        while (rev != null) {
            res.Add(rev.val);
            rev = rev.next;
        }
        Console.WriteLine(JsonSerializer.Serialize(res));
    }
}",
                JsDriver = @"// {{SOLUTION}}
const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: false });
rl.on('line', (line) => {
    const vals = JSON.parse(line);
    let head = null, tail = null;
    for (let v of vals) {
        let n = new ListNode(v);
        if (!head) { head = n; tail = n; }
        else { tail.next = n; tail = n; }
    }
    let rev = reverseList(head);
    let res = [];
    while (rev) { res.push(rev.val); rev = rev.next; }
    console.log(JSON.stringify(res));
});",
                VideoUrl = "https://www.youtube.com/watch?v=G0_I-ZF0S38"
            };

            var mergeLists = new Problem
            {
                Id = "merge-two-sorted-lists",
                Title = "Merge Two Sorted Lists",
                Difficulty = "Easy",
                Category = "Linked List",
                Description = @"You are given the heads of two sorted linked lists `list1` and `list2`. 

Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.

Return *the head of the merged linked list*.",
                CsharpBoilerplate = @"public class ListNode {
    public int val;
    public ListNode next;
    public ListNode(int val=0, ListNode next=null) {
        this.val = val;
        this.next = next;
    }
}

public class Solution {
    public ListNode MergeTwoLists(ListNode list1, ListNode list2) {
        
    }
}",
                JavaBoilerplate = @"class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
}
class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        
    }
}",
                PythonBoilerplate = @"class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
class Solution:
    def mergeTwoLists(self, list1: ListNode, list2: ListNode) -> ListNode:
        pass",
                CppBoilerplate = @"struct ListNode {
    int val;
    ListNode *next;
    ListNode(int x) : val(x), next(nullptr) {}
};
class Solution {
public:
    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
        
    }
};",
                CBoilerplate = @"struct ListNode {
    int val;
    struct ListNode *next;
};
struct ListNode* mergeTwoLists(struct ListNode* list1, struct ListNode* list2) {
    
}",
                JsBoilerplate = @"function ListNode(val, next) {
    this.val = (val===undefined ? 0 : val)
    this.next = (next===undefined ? null : next)
}
var mergeTwoLists = function(list1, list2) {
    
};",
                CsharpDriver = @"// {{SOLUTION}}
using System;
using System.Collections.Generic;
using System.Text.Json;

public class Program {
    public static void Main() {
        string line1 = Console.ReadLine();
        string line2 = Console.ReadLine();
        int[] vals1 = JsonSerializer.Deserialize<int[]>(line1);
        int[] vals2 = JsonSerializer.Deserialize<int[]>(line2);
        ListNode l1 = ArrayToList(vals1);
        ListNode l2 = ArrayToList(vals2);
        var sol = new Solution();
        ListNode merged = sol.MergeTwoLists(l1, l2);
        List<int> res = new List<int>();
        while (merged != null) {
            res.Add(merged.val);
            merged = merged.next;
        }
        Console.WriteLine(JsonSerializer.Serialize(res));
    }
    private static ListNode ArrayToList(int[] vals) {
        ListNode head = null;
        ListNode tail = null;
        foreach (var v in vals) {
            var node = new ListNode(v);
            if (head == null) { head = node; tail = node; }
            else { tail.next = node; tail = node; }
        }
        return head;
    }
}",
                JsDriver = @"// {{SOLUTION}}
const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: false });
let lines = [];
rl.on('line', (line) => lines.push(line));
rl.on('close', () => {
    const vals1 = JSON.parse(lines[0]);
    const vals2 = JSON.parse(lines[1]);
    const build = (arr) => {
        let head = null, tail = null;
        for (let v of arr) {
            let n = new ListNode(v);
            if (!head) { head = n; tail = n; }
            else { tail.next = n; tail = n; }
        }
        return head;
    };
    let merged = mergeTwoLists(build(vals1), build(vals2));
    let res = [];
    while (merged) { res.push(merged.val); merged = merged.next; }
    console.log(JSON.stringify(res));
});",
                VideoUrl = "https://www.youtube.com/watch?v=GfRQvf7MB3k"
            };

            var longestSubstring = new Problem
            {
                Id = "longest-substring-without-repeating-characters",
                Title = "Longest Substring Without Repeating Characters",
                Difficulty = "Medium",
                Category = "Sliding Window",
                Description = @"Given a string `s`, find the length of the **longest substring** without repeating characters.",
                CsharpBoilerplate = @"public class Solution {
    public int LengthOfLongestSubstring(string s) {
        
    }
}",
                JavaBoilerplate = @"class Solution {
    public int lengthOfLongestSubstring(String s) {
        
    }
}",
                PythonBoilerplate = @"class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        pass",
                CppBoilerplate = @"#include <string>
using namespace std;
class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        
    }
};",
                CBoilerplate = @"int lengthOfLongestSubstring(char* s) {
    
}",
                JsBoilerplate = @"var lengthOfLongestSubstring = function(s) {
    
};",
                CsharpDriver = @"// {{SOLUTION}}
using System;

public class Program {
    public static void Main() {
        string s = Console.ReadLine() ?? ""\u0022\u0022"";
        if (s.StartsWith(""\u0022"") && s.EndsWith(""\u0022"")) {
            s = s.Substring(1, s.Length - 2);
        }
        var sol = new Solution();
        Console.WriteLine(sol.LengthOfLongestSubstring(s));
    }
}",
                JsDriver = @"// {{SOLUTION}}
const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: false });
rl.on('line', (line) => {
    let s = line.trim();
    if (s.startsWith('""') && s.endsWith('""')) s = s.substring(1, s.length - 1);
    console.log(lengthOfLongestSubstring(s));
});",
                VideoUrl = "https://www.youtube.com/watch?v=wiGpG14c558"
            };

            var maxWater = new Problem
            {
                Id = "container-with-most-water",
                Title = "Container With Most Water",
                Difficulty = "Medium",
                Category = "Two Pointers",
                Description = @"You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the `i-th` line are `(i, 0)` and `(i, height[i])`.

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return *the maximum amount of water a container can store*.",
                CsharpBoilerplate = @"public class Solution {
    public int MaxArea(int[] height) {
        
    }
}",
                JavaBoilerplate = @"class Solution {
    public int maxArea(int[] height) {
        
    }
}",
                PythonBoilerplate = @"class Solution:
    def maxArea(self, height: list[int]) -> int:
        pass",
                CppBoilerplate = @"#include <vector>
using namespace std;
class Solution {
public:
    int maxArea(vector<int>& height) {
        
    }
};",
                CBoilerplate = @"int maxArea(int* height, int heightSize) {
    
}",
                JsBoilerplate = @"var maxArea = function(height) {
    
};",
                CsharpDriver = @"// {{SOLUTION}}
using System;
using System.Text.Json;

public class Program {
    public static void Main() {
        string line = Console.ReadLine();
        int[] height = JsonSerializer.Deserialize<int[]>(line);
        var sol = new Solution();
        Console.WriteLine(sol.MaxArea(height));
    }
}",
                JsDriver = @"// {{SOLUTION}}
const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: false });
rl.on('line', (line) => {
    const height = JSON.parse(line.trim());
    console.log(maxArea(height));
});",
                VideoUrl = "https://www.youtube.com/watch?v=UuiTKBwPgAo"
            };

            var validAnagram = new Problem
            {
                Id = "valid-anagram",
                Title = "Valid Anagram",
                Difficulty = "Easy",
                Category = "Arrays & Hashing",
                Description = @"Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.",
                CsharpBoilerplate = @"public class Solution {
    public bool IsAnagram(string s, string t) {
        
    }
}",
                JavaBoilerplate = @"class Solution {
    public boolean isAnagram(String s, String t) {
        
    }
}",
                PythonBoilerplate = @"class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        pass",
                CppBoilerplate = @"#include <string>
using namespace std;
class Solution {
public:
    bool isAnagram(string s, string t) {
        
    }
};",
                CBoilerplate = @"#include <stdbool.h>
bool isAnagram(char* s, char* t) {
    
}",
                JsBoilerplate = @"var isAnagram = function(s, t) {
    
};",
                CsharpDriver = @"// {{SOLUTION}}
using System;

public class Program {
    public static void Main() {
        string s = Console.ReadLine() ?? """";
        string t = Console.ReadLine() ?? """";
        if (s.StartsWith(""\u0022"") && s.EndsWith(""\u0022"")) s = s.Substring(1, s.Length - 2);
        if (t.StartsWith(""\u0022"") && t.EndsWith(""\u0022"")) t = t.Substring(1, t.Length - 2);
        var sol = new Solution();
        Console.WriteLine(sol.IsAnagram(s, t).ToString().ToLower());
    }
}",
                JsDriver = @"// {{SOLUTION}}
const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: false });
let lines = [];
rl.on('line', (line) => lines.push(line));
rl.on('close', () => {
    let s = lines[0].trim();
    let t = lines[1].trim();
    if (s.startsWith('""') && s.endsWith('""')) s = s.substring(1, s.length - 1);
    if (t.startsWith('""') && t.endsWith('""')) t = t.substring(1, t.length - 1);
    console.log(isAnagram(s, t).toString());
});",
                VideoUrl = "https://www.youtube.com/watch?v=9UtInBqnCgA"
            };

            var invertTree = new Problem
            {
                Id = "invert-binary-tree",
                Title = "Invert Binary Tree",
                Difficulty = "Easy",
                Category = "Trees",
                Description = @"Given the `root` of a binary tree, invert the tree, and return *its root*.",
                CsharpBoilerplate = @"public class TreeNode {
    public int val;
    public TreeNode left;
    public TreeNode right;
    public TreeNode(int val=0, TreeNode left=null, TreeNode right=null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

public class Solution {
    public TreeNode InvertTree(TreeNode root) {
        
    }
}",
                JavaBoilerplate = @"class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int val) { this.val = val; }
}
class Solution {
    public TreeNode invertTree(TreeNode root) {
        
    }
}",
                PythonBoilerplate = @"class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
class Solution:
    def invertTree(self, root: TreeNode) -> TreeNode:
        pass",
                CppBoilerplate = @"struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};
class Solution {
public:
    TreeNode* invertTree(TreeNode* root) {
        
    }
};",
                CBoilerplate = @"struct TreeNode {
    int val;
    struct TreeNode *left;
    struct TreeNode *right;
};
struct TreeNode* invertTree(struct TreeNode* root) {
    
}",
                JsBoilerplate = @"function TreeNode(val, left, right) {
    this.val = (val===undefined ? 0 : val)
    this.left = (left===undefined ? null : left)
    this.right = (right===undefined ? null : right)
}
var invertTree = function(root) {
    
};",
                CsharpDriver = @"// {{SOLUTION}}
using System;
using System.Collections.Generic;
using System.Text.Json;

public class Program {
    public static void Main() {
        string line = Console.ReadLine();
        int?[] vals = JsonSerializer.Deserialize<int?[]>(line);
        TreeNode root = ArrayToTree(vals);
        var sol = new Solution();
        TreeNode inverted = sol.InvertTree(root);
        int?[] res = TreeToArray(inverted);
        Console.WriteLine(JsonSerializer.Serialize(res));
    }
    private static TreeNode ArrayToTree(int?[] vals) {
        if (vals == null || vals.Length == 0 || vals[0] == null) return null;
        TreeNode root = new TreeNode(vals[0].Value);
        Queue<TreeNode> q = new Queue<TreeNode>();
        q.Enqueue(root);
        int i = 1;
        while (q.Count > 0 && i < vals.Length) {
            TreeNode curr = q.Dequeue();
            if (i < vals.Length && vals[i] != null) {
                curr.left = new TreeNode(vals[i].Value);
                q.Enqueue(curr.left);
            }
            i++;
            if (i < vals.Length && vals[i] != null) {
                curr.right = new TreeNode(vals[i].Value);
                q.Enqueue(curr.right);
            }
            i++;
        }
        return root;
    }
    private static int?[] TreeToArray(TreeNode root) {
        if (root == null) return Array.Empty<int?>();
        List<int?> list = new List<int?>();
        Queue<TreeNode> q = new Queue<TreeNode>();
        q.Enqueue(root);
        while (q.Count > 0) {
            TreeNode curr = q.Dequeue();
            if (curr != null) {
                list.Add(curr.val);
                q.Enqueue(curr.left);
                q.Enqueue(curr.right);
            } else {
                list.Add(null);
            }
        }
        int lastIndex = list.Count - 1;
        while (lastIndex >= 0 && list[lastIndex] == null) lastIndex--;
        int?[] res = new int?[lastIndex + 1];
        for (int i = 0; i <= lastIndex; i++) res[i] = list[i];
        return res;
    }
}",
                JsDriver = @"// {{SOLUTION}}
const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: false });
rl.on('line', (line) => {
    const vals = JSON.parse(line);
    const build = (arr) => {
        if (!arr.length || arr[0] === null) return null;
        let root = new TreeNode(arr[0]);
        let q = [root];
        let i = 1;
        while (q.length && i < arr.length) {
            let curr = q.shift();
            if (i < arr.length && arr[i] !== null) {
                curr.left = new TreeNode(arr[i]);
                q.push(curr.left);
            }
            i++;
            if (i < arr.length && arr[i] !== null) {
                curr.right = new TreeNode(arr[i]);
                q.push(curr.right);
            }
            i++;
        }
        return root;
    };
    const toArr = (node) => {
        if (!node) return [];
        let list = [];
        let q = [node];
        while (q.length) {
            let curr = q.shift();
            if (curr) {
                list.push(curr.val);
                q.push(curr.left);
                q.push(curr.right);
            } else {
                list.push(null);
            }
        }
        while(list.length && list[list.length - 1] === null) list.pop();
        return list;
    };
    let inverted = invertTree(build(vals));
    console.log(JSON.stringify(toArr(inverted)));
});",
                VideoUrl = "https://www.youtube.com/watch?v=OnSn2XEQ4MY"
            };

            modelBuilder.Entity<Problem>().HasData(
                twoSum, validParentheses, stock, binarySearch, 
                reverseList, mergeLists, longestSubstring, maxWater, 
                validAnagram, invertTree
            );

            // Seed Test Cases
            modelBuilder.Entity<TestCase>().HasData(
                // Two Sum Test Cases
                new TestCase { Id = 1, ProblemId = "two-sum", Input = "[2,7,11,15]\n9", ExpectedOutput = "[0,1]", IsSample = true },
                new TestCase { Id = 2, ProblemId = "two-sum", Input = "[3,2,4]\n6", ExpectedOutput = "[1,2]", IsSample = true },
                new TestCase { Id = 3, ProblemId = "two-sum", Input = "[3,3]\n6", ExpectedOutput = "[0,1]", IsSample = false },
                
                // Valid Parentheses Test Cases
                new TestCase { Id = 4, ProblemId = "valid-parentheses", Input = "\"()\"", ExpectedOutput = "true", IsSample = true },
                new TestCase { Id = 5, ProblemId = "valid-parentheses", Input = "\"()[]{}\"", ExpectedOutput = "true", IsSample = true },
                new TestCase { Id = 6, ProblemId = "valid-parentheses", Input = "\"(]\"", ExpectedOutput = "false", IsSample = false },
                new TestCase { Id = 7, ProblemId = "valid-parentheses", Input = "\"({[]})\"", ExpectedOutput = "true", IsSample = false },

                // Stock Test Cases
                new TestCase { Id = 8, ProblemId = "best-time-to-buy-and-sell-stock", Input = "[7,1,5,3,6,4]", ExpectedOutput = "5", IsSample = true },
                new TestCase { Id = 9, ProblemId = "best-time-to-buy-and-sell-stock", Input = "[7,6,4,3,1]", ExpectedOutput = "0", IsSample = true },
                new TestCase { Id = 10, ProblemId = "best-time-to-buy-and-sell-stock", Input = "[2,4,1]", ExpectedOutput = "2", IsSample = false },

                // Binary Search Test Cases
                new TestCase { Id = 11, ProblemId = "binary-search", Input = "[-1,0,3,5,9,12]\n9", ExpectedOutput = "4", IsSample = true },
                new TestCase { Id = 12, ProblemId = "binary-search", Input = "[-1,0,3,5,9,12]\n2", ExpectedOutput = "-1", IsSample = true },
                new TestCase { Id = 13, ProblemId = "binary-search", Input = "[5]\n5", ExpectedOutput = "0", IsSample = false },

                // Reverse Linked List Test Cases
                new TestCase { Id = 14, ProblemId = "reverse-linked-list", Input = "[1,2,3,4,5]", ExpectedOutput = "[5,4,3,2,1]", IsSample = true },
                new TestCase { Id = 15, ProblemId = "reverse-linked-list", Input = "[]", ExpectedOutput = "[]", IsSample = true },
                new TestCase { Id = 16, ProblemId = "reverse-linked-list", Input = "[1]", ExpectedOutput = "[1]", IsSample = false },

                // Merge Two Sorted Lists Test Cases
                new TestCase { Id = 17, ProblemId = "merge-two-sorted-lists", Input = "[1,2,4]\n[1,3,4]", ExpectedOutput = "[1,1,2,3,4,4]", IsSample = true },
                new TestCase { Id = 18, ProblemId = "merge-two-sorted-lists", Input = "[]\n[]", ExpectedOutput = "[]", IsSample = true },
                new TestCase { Id = 19, ProblemId = "merge-two-sorted-lists", Input = "[]\n[0]", ExpectedOutput = "[0]", IsSample = false },

                // Longest Substring Test Cases
                new TestCase { Id = 20, ProblemId = "longest-substring-without-repeating-characters", Input = "\"abcabcbb\"", ExpectedOutput = "3", IsSample = true },
                new TestCase { Id = 21, ProblemId = "longest-substring-without-repeating-characters", Input = "\"bbbbb\"", ExpectedOutput = "1", IsSample = true },
                new TestCase { Id = 22, ProblemId = "longest-substring-without-repeating-characters", Input = "\"pwwkew\"", ExpectedOutput = "3", IsSample = false },

                // Container With Most Water Test Cases
                new TestCase { Id = 23, ProblemId = "container-with-most-water", Input = "[1,8,6,2,5,4,8,3,7]", ExpectedOutput = "49", IsSample = true },
                new TestCase { Id = 24, ProblemId = "container-with-most-water", Input = "[1,1]", ExpectedOutput = "1", IsSample = true },
                new TestCase { Id = 25, ProblemId = "container-with-most-water", Input = "[4,3,2,1,4]", ExpectedOutput = "16", IsSample = false },

                // Valid Anagram Test Cases
                new TestCase { Id = 26, ProblemId = "valid-anagram", Input = "\"anagram\"\n\"nagaram\"", ExpectedOutput = "true", IsSample = true },
                new TestCase { Id = 27, ProblemId = "valid-anagram", Input = "\"rat\"\n\"car\"", ExpectedOutput = "false", IsSample = true },
                new TestCase { Id = 28, ProblemId = "valid-anagram", Input = "\"a\"\n\"ab\"", ExpectedOutput = "false", IsSample = false },

                // Invert Binary Tree Test Cases
                new TestCase { Id = 29, ProblemId = "invert-binary-tree", Input = "[4,2,7,1,3,6,9]", ExpectedOutput = "[4,7,2,9,6,3,1]", IsSample = true },
                new TestCase { Id = 30, ProblemId = "invert-binary-tree", Input = "[]", ExpectedOutput = "[]", IsSample = true },
                new TestCase { Id = 31, ProblemId = "invert-binary-tree", Input = "[1,2]", ExpectedOutput = "[1,null,2]", IsSample = false }
            );

            // Seed Interview Questions
            modelBuilder.Entity<InterviewQuestion>().HasData(
                new InterviewQuestion
                {
                    Id = 1,
                    Category = "Behavioral",
                    QuestionText = "Tell me about a time you had to resolve a conflict with a team member. How did you approach it?",
                    IdealKeywords = "communication;empathy;listen;compromise;constructive;collaboration;resolution",
                    SampleAnswer = "In my last team project, a peer and I had a conflict regarding our database design. He wanted MongoDB and I preferred PostgreSQL. I scheduled a quick meeting to listen to his points. I documented both options, highlighted scalability vs. strict schema needs, and we reached a compromise to use PostgreSQL for relational transactions and MongoDB for chat logs. This collaboration strengthened our system design and team trust."
                },
                new InterviewQuestion
                {
                    Id = 2,
                    Category = "System Design",
                    QuestionText = "Design a URL Shortening service like TinyURL. What are the key architectural components and constraints?",
                    IdealKeywords = "hashing;Base62;redirect;database;cache;Redis;unique;scalability",
                    SampleAnswer = "To design a URL shortener, we need a web tier to accept long URLs and perform redirection (HTTP 301/302). Key components include: 1. A Hashing/ID Generation Service using Base62 encoding of an auto-incrementing ID. 2. A distributed cache like Redis to cache high-frequency lookups (reads). 3. A relational database (PostgreSQL) or NoSQL database (Cassandra) to map the short hash to the long URL. We'd aim for high-availability since reads heavily outnumber writes."
                },
                new InterviewQuestion
                {
                    Id = 3,
                    Category = "C# / .NET",
                    QuestionText = "Explain the difference between interface inheritance and abstract class inheritance in C#.",
                    IdealKeywords = "interface;abstract class;multiple inheritance;implementation;methods;constructors;state",
                    SampleAnswer = "In C#, interfaces define contracts with no state (fields) and allow multiple inheritance, whereas abstract classes can maintain state (instance fields, constructors) and provide partial method implementations, but classes can only inherit from one abstract class. Abstract classes are useful for closely-related object hierarchies, while interfaces are suited for defining decoupled capabilities across unrelated classes."
                }
            );
        }
    }
}
