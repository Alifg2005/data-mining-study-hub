import type { Chapter } from '../../types/content';

/**
 * Chapter 5: Frequent Pattern Mining (course Lecture 5)
 * Sources:
 *   association-rules  "Association Rules Exercise" PDF, 4 pages (image-only; 12 transactions)
 *   hash-tree          "Pattern Mining - Hash Tree" PDF, 5 pages
 *   fp-growth          "FP Growth Approach" PDF, 7 pages (TIDs 100-500, min support 3)
 *   fp-examples        "Frequent Pattern" Word notes (image-only), cited by section heading
 *   eclat              "ECLAT - Association Rule Mining" PDF, 2 pages
 *   assoc-vs-corr      "Difference Between Association Rules and Correlation Analysis" PDF, 2 pages
 *
 * Numbering note: the instructor's textbook-style outline lists this topic as an unnumbered
 * "Pattern Mining" section; this site numbers chapters by lecture order. The outline names the
 * Apriori algorithm, but no source explains it, so this chapter does not teach or quiz it.
 *
 * Every number used here was recomputed from the source's own data. Excluded from the quiz
 * (see the private source analysis report): the two mismatched 3-itemset candidate counts and
 * the conflicting support/confidence thresholds in the association-rules exercise; the
 * {E, K} support printed in fp-examples; the page-1 item ordering and blank tables in
 * fp-growth; the garbled step tables in hash-tree.
 */
export const chapter05: Chapter = {
  id: 'chapter-05',
  number: 5,
  title: 'Frequent Pattern Mining',
  description:
    'Support and confidence, finding frequent itemsets and association rules, hash trees, FP-growth, ECLAT, closed and maximal itemsets, and how association rules differ from correlation.',
  sources: [
    { id: 'association-rules', title: 'Association rules exercise', unit: 'page' },
    { id: 'hash-tree', title: 'Hash tree notes', unit: 'page' },
    { id: 'fp-growth', title: 'FP-growth notes', unit: 'page' },
    { id: 'fp-examples', title: 'Frequent pattern examples', unit: 'section' },
    { id: 'eclat', title: 'ECLAT notes', unit: 'page' },
    { id: 'assoc-vs-corr', title: 'Association rules vs. correlation', unit: 'page' },
  ],

  learningObjectives: [
    'Compute support and confidence for an association rule X ⇒ Y.',
    'Follow a level-wise search for frequent 1-, 2- and 3-itemsets and generate rules from a frequent itemset.',
    'Explain how a hash tree organizes candidate itemsets using h(x) = x mod 3 and a maximum leaf size.',
    'Build and read an FP-tree, and mine it with conditional pattern bases.',
    'Use ECLAT tidsets to find frequent itemsets.',
    'Recognize closed and maximal frequent itemsets in a lattice.',
    'Distinguish association rules from correlation analysis.',
  ],

  reviewSections: [
    {
      id: 'basic-concepts',
      title: 'Basic concepts: support and confidence',
      source: { sourceId: 'association-rules', page: 2, section: 'Association Rules Exercise' },
      blocks: [
        {
          type: 'paragraph',
          text: 'Association rules discover **frequent co-occurrence** of items, linking antecedents (conditions) to consequents (results), e.g., buying bread leads to buying butter. The goal is to find **affinities between products**: which products sell together often.',
        },
        {
          type: 'definitions',
          items: [
            { term: 'Rule', definition: 'X ⇒ Y: if X occurs, Y is likely to occur.' },
            { term: 'Support', definition: 'Support = frq(X, Y) / N: the share of all N transactions that contain both X and Y.' },
            { term: 'Confidence', definition: 'Confidence = frq(X, Y) / frq(X): of the transactions containing X, the share that also contain Y.' },
          ],
        },
      ],
    },
    {
      id: 'frequent-itemsets-example',
      title: 'Worked example: frequent itemsets',
      source: { sourceId: 'association-rules', page: 3, section: 'Association Rules Exercise' },
      blocks: [
        {
          type: 'table',
          caption: 'Transactions list (12 sales transactions)',
          columns: ['#', 'Items'],
          rows: [
            ['1', 'Milk, Egg, Bread, Butter'],
            ['2', 'Milk, Butter, Egg, Ketchup'],
            ['3', 'Bread, Butter, Ketchup'],
            ['4', 'Milk, Bread, Butter'],
            ['5', 'Bread, Butter, Cookies'],
            ['6', 'Milk, Bread, Butter, Cookies'],
            ['7', 'Milk, Cookies'],
            ['8', 'Milk, Bread, Butter'],
            ['9', 'Bread, Butter, Egg, Cookies'],
            ['10', 'Milk, Butter, Bread'],
            ['11', 'Milk, Bread, Butter'],
            ['12', 'Milk, Bread, Cookies, Ketchup'],
          ],
        },
        {
          type: 'table',
          caption: '1-item sets',
          columns: ['Item', 'Frequency', 'Frequent?'],
          rows: [
            ['Milk', '9', '✓'],
            ['Bread', '10', '✓'],
            ['Butter', '10', '✓'],
            ['Egg', '3', '✗'],
            ['Ketchup', '3', '✗'],
            ['Cookies', '5', '✓'],
          ],
        },
        {
          type: 'table',
          caption: '2-item sets (built from the frequent items)',
          columns: ['Itemset', 'Frequency', 'Frequent?'],
          rows: [
            ['Milk, Bread', '7', '✓'],
            ['Milk, Butter', '7', '✓'],
            ['Milk, Cookies', '3', '✗'],
            ['Bread, Butter', '9', '✓'],
            ['Butter, Cookies', '3', '✗'],
            ['Bread, Cookies', '4', '✓'],
          ],
        },
        {
          type: 'paragraph',
          text: 'The only **frequent 3-item set** is **{Milk, Bread, Butter}** with frequency **6**.',
        },
        {
          type: 'callout',
          tone: 'caution',
          title: 'Two details differ within the exercise',
          text: 'The first page sets support at 33% and confidence at 50%; the rule-generation page uses minimum support 30% and minimum confidence 60%. The 3-item candidate table also shows two counts that do not match the transaction list, so only its frequent result is reproduced here.',
        },
      ],
    },
    {
      id: 'rule-generation',
      title: 'Generating association rules',
      source: { sourceId: 'association-rules', page: 4, section: 'Association Rule Mining - Subset Creation' },
      blocks: [
        {
          type: 'list',
          items: [
            'Frequent 3-item set: **I = {Milk, Bread, Butter}**.',
            'Non-empty subsets used: {Milk}, {Bread}, {Butter}, {Milk, Bread}, {Milk, Butter}, {Bread, Butter}.',
            'For every non-empty subset S of I, form the rule **S → (I − S)**, valid **if support(I) / support(S) ≥ min_confidence**.',
          ],
        },
        {
          type: 'table',
          caption: 'The two rules worked through in the notes (min confidence 60% on that page)',
          columns: ['Rule', 'Support', 'Confidence', 'Result'],
          rows: [
            ['{Milk} → {Bread, Butter}', '6/12 = 50%', '6/9 = 66.67%', 'Valid'],
            ['{Bread} → {Milk, Butter}', '6/12 = 50%', '6/10 = 60%', 'Valid'],
          ],
        },
      ],
    },
    {
      id: 'hash-tree',
      title: 'Hash tree for candidate itemsets',
      source: { sourceId: 'hash-tree', page: 4, section: 'Key points for students' },
      blocks: [
        {
          type: 'paragraph',
          text: 'A hash tree organizes candidate itemsets efficiently, helping **reduce the number of candidates examined when counting support**. The example stores 15 candidate 3-itemsets.',
        },
        {
          type: 'table',
          caption: 'Hash function h(x) = x mod 3',
          columns: ['Hash value', 'Items'],
          rows: [
            ['1', '1, 4, 7'],
            ['2', '2, 5, 8'],
            ['0', '3, 6, 9'],
          ],
        },
        {
          type: 'list',
          items: [
            '**Root level:** hash the first item of each candidate.',
            '**Second level:** hash the second item when a node must be split.',
            '**Third level:** hash the third item when another split is required.',
            '**Maximum leaf size** (3 in the example): split a leaf only when its number of candidates **exceeds** the limit.',
          ],
        },
        {
          type: 'tree',
          root: {
            label: 'Final hash tree (leaves as shown in the notes)',
            children: [
              {
                label: 'First item in {1, 4, 7}',
                children: [
                  { label: '{1 4 5}' },
                  { label: 'Split on the second item', children: [{ label: '{1 2 4}, {4 5 7}' }, { label: '{1 2 5}, {4 5 8}' }, { label: '{1 5 9}' }] },
                  { label: '{1 3 6}' },
                ],
              },
              { label: 'First item in {2, 5, 8}', children: [{ label: '{2 3 4}, {5 6 7}' }] },
              {
                label: 'First item in {3, 6, 9}',
                children: [{ label: '{3 4 5}' }, { label: '{3 5 6}, {3 5 7}, {6 8 9}' }, { label: '{3 6 7}, {3 6 8}' }],
              },
            ],
          },
        },
        {
          type: 'example',
          title: 'Subsets of a transaction (p. 5)',
          text: 'Given transaction t = {1, 2, 3, 5, 6}, the possible subsets of size 3 are found level by level (fix the first item, then the second):',
          items: ['123, 125, 126, 135, 136, 156, 235, 236, 256, 356: **10 subsets**.'],
        },
      ],
    },
    {
      id: 'fp-growth',
      title: 'FP-growth',
      source: { sourceId: 'fp-growth', page: 1, section: 'FP Growth Approach' },
      blocks: [
        {
          type: 'process',
          steps: [
            { title: 'Scan the database once', description: 'Find the frequent 1-itemsets (single-item patterns).' },
            { title: 'Build the F-list', description: 'Sort the frequent items in descending order of frequency.' },
            { title: 'Scan the database again', description: 'Construct the FP-tree from the filtered, reordered transactions.' },
            { title: 'Mine the FP-tree', description: 'For each frequent item, build its conditional pattern base and find the patterns ending in it.' },
          ],
        },
        {
          type: 'table',
          caption: 'Example database (min support count = 3)',
          columns: ['TID', 'Items bought', 'Ordered frequent items'],
          rows: [
            ['100', 'f, a, c, d, g, i, m, p', 'f, c, a, m, p'],
            ['200', 'a, b, c, f, l, m, o', 'f, c, a, b, m'],
            ['300', 'b, f, h, j, o, w', 'f, b'],
            ['400', 'b, c, k, s, p', 'c, b, p'],
            ['500', 'a, f, c, e, l, p, m, n', 'f, c, a, m, p'],
          ],
        },
        {
          type: 'paragraph',
          text: 'Frequent items: c:4, f:4, a:3, b:3, m:3, p:3. Items such as l and o (support 2) are removed. With a consistent tie-breaking order the **F-list is f > c > a > b > m > p**.',
        },
        {
          type: 'list',
          title: 'FP-tree paths (node = item:count)',
          items: [
            'Root → f:4 → c:3 → a:3 → m:2 → p:2',
            'Root → f:4 → c:3 → a:3 → b:1 → m:1',
            'Root → f:4 → b:1',
            'Root → c:1 → b:1 → p:1',
          ],
        },
        {
          type: 'callout',
          tone: 'caution',
          title: 'Item order differs on the first page',
          text: 'A handwritten-style image on page 1 lists the items as f, c, a, m, p, b; the text, the tree and the mining steps use f > c > a > b > m > p. This review follows the text.',
        },
      ],
    },
    {
      id: 'fp-growth-mining',
      title: 'Mining the FP-tree',
      source: { sourceId: 'fp-growth', page: 5, section: 'Step 6: Mine the FP-tree using conditional pattern bases' },
      blocks: [
        {
          type: 'table',
          columns: ['Suffix', 'Conditional pattern base', 'Frequent patterns (support)'],
          rows: [
            ['p', '{f, c, a, m}: 2, {c, b}: 1', '{p}: 3, {c, p}: 3'],
            ['m', '{f, c, a}: 2, {f, c, a, b}: 1', '{m}, {f, m}, {c, m}, {a, m}, {f, c, m}, {f, a, m}, {c, a, m}, {f, c, a, m}: all 3'],
            ['b', '{f, c, a}: 1, {f}: 1, {c}: 1', '{b}: 3 only'],
            ['a', '{f, c}: 3', '{a}, {f, a}, {c, a}, {f, c, a}: all 3'],
            ['c', '{f}: 3', '{c}: 4, {f, c}: 3'],
            ['f', '(none)', '{f}: 4'],
          ],
        },
        {
          type: 'paragraph',
          text: 'Final result: **18 frequent itemsets** (6 of size 1, 7 of size 2, 4 of size 3, 1 of size 4). Note that **{f, c} has support 3**, even though {f} and {c} each have support 4: only three transactions contain both.',
        },
      ],
    },
    {
      id: 'fp-growth-example-2',
      title: 'FP-growth: a second example',
      source: { sourceId: 'fp-examples', section: 'Frequent Pattern (FP) Growth Algorithm Association Rule Mining' },
      blocks: [
        {
          type: 'table',
          caption: 'Minimum support 3. (T5 lists O twice in the source; it is counted once.)',
          columns: ['Transaction', 'Items', 'Ordered-item set'],
          rows: [
            ['T1', 'E, K, M, N, O, Y', 'K, E, M, O, Y'],
            ['T2', 'D, E, K, N, O, Y', 'K, E, O, Y'],
            ['T3', 'A, E, K, M', 'K, E, M'],
            ['T4', 'C, K, M, U, Y', 'K, M, Y'],
            ['T5', 'C, E, I, K, O, O', 'K, E, O'],
          ],
        },
        {
          type: 'paragraph',
          text: 'Frequent pattern set **L = {K:5, E:4, M:3, O:3, Y:3}**, stored in descending order of frequency. The FP-tree is K:5 → E:4 → M:2 → O:1 → Y:1, with E:4 → O:2 → Y:1 and K:5 → M:1 → Y:1.',
        },
        {
          type: 'table',
          columns: ['Item', 'Conditional pattern base', 'Conditional FP-tree', 'Frequent patterns generated'],
          rows: [
            ['Y', '{K, E, M, O: 1}, {K, E, O: 1}, {K, M: 1}', '{K: 3}', '{K, Y: 3}'],
            ['O', '{K, E, M: 1}, {K, E: 2}', '{K, E: 3}', '{K, O: 3}, {E, O: 3}, {E, K, O: 3}'],
            ['M', '{K, E: 2}, {K: 1}', '{K: 3}', '{K, M: 3}'],
            ['E', '{K: 4}', '{K: 4}', '{E, K} (see note)'],
          ],
        },
        {
          type: 'callout',
          tone: 'caution',
          title: 'Check the support of {E, K}',
          text: 'The source prints {E, K: 3}, but the conditional FP-tree it shows for E is {K: 4}. Ask your instructor which value is intended.',
        },
      ],
    },
    {
      id: 'eclat',
      title: 'ECLAT',
      source: { sourceId: 'eclat', page: 1, section: 'ECLAT - Association Rule Mining' },
      blocks: [
        {
          type: 'paragraph',
          text: '**ECLAT** stands for **Equivalence Class Clustering and bottom-up Lattice Traversal**, one of the popular methods of association rule mining. Each itemset is stored with its **tidset**: the IDs of the transactions that contain it.',
        },
        {
          type: 'table',
          caption: 'k = 1 tidsets (minimum support = 2)',
          columns: ['Item', 'Tidset'],
          rows: [
            ['Bread', 'T1, T4, T5, T7, T8, T9'],
            ['Butter', 'T1, T2, T3, T4, T6, T8, T9'],
            ['Milk', 'T3, T5, T6, T7, T8, T9'],
            ['Coke', 'T2, T4'],
            ['Jam', 'T1, T8'],
          ],
        },
        {
          type: 'table',
          caption: 'k = 2 tidsets (support = number of transactions)',
          columns: ['Itemset', 'Tidset', 'Meets min support 2?'],
          rows: [
            ['Bread, Butter', 'T1, T4, T8, T9', '✓'],
            ['Bread, Milk', 'T5, T7, T8, T9', '✓'],
            ['Bread, Coke', 'T4', '✗'],
            ['Bread, Jam', 'T1, T8', '✓'],
            ['Butter, Milk', 'T3, T6, T8, T9', '✓'],
            ['Butter, Coke', 'T2, T4', '✓'],
            ['Butter, Jam', 'T1, T8', '✓'],
            ['Milk, Jam', 'T8', '✗'],
          ],
        },
        {
          type: 'list',
          title: 'Larger itemsets (p. 2)',
          items: [
            'k = 3: {Bread, Butter, Milk} → T8, T9 and {Bread, Butter, Jam} → T1, T8 meet the minimum support.',
            'The search stops at k = 4 ({Bread, Butter, Milk, Jam} → T8) because there are no more item-tidset pairs to combine.',
            'Resulting recommendations: Bread → Butter, Milk or Jam; Butter → Milk, Coke or Jam; Bread and Butter → Milk or Jam.',
          ],
        },
      ],
    },
    {
      id: 'closed-and-maximal',
      title: 'Closed and maximal frequent itemsets',
      source: { sourceId: 'fp-examples', section: 'Closed And Maximal Frequent Itemsets' },
      blocks: [
        {
          type: 'paragraph',
          text: 'The notes use a lattice of all itemsets over items A to E for five transactions (1: ABC, 2: ABCD, 3: BCE, 4: ACDE, 5: DE) with **minimum support count = 2**.',
        },
        {
          type: 'table',
          columns: ['Result in the notes', 'Count', 'Itemsets marked'],
          rows: [
            ['Frequent itemsets', '14', 'All itemsets with support ≥ 2'],
            ['Closed frequent itemsets', '9', 'C, D, E, AC, BC, CE, DE, ABC, ACD'],
            ['Maximal frequent itemsets', '4', 'CE, DE, ABC, ACD ("closed and maximal")'],
          ],
        },
        {
          type: 'paragraph',
          text: 'The notes label **C, D and E** as "closed but not maximal".',
        },
        {
          type: 'callout',
          tone: 'supplemental',
          title: 'Supplemental definitions (not written out in the notes)',
          text: 'Standard textbook definitions: a frequent itemset is **closed** if no superset has the same support; it is **maximal** if no superset is frequent. Every maximal itemset is therefore also closed.',
        },
      ],
    },
    {
      id: 'association-vs-correlation',
      title: 'Association rules vs. correlation analysis',
      source: { sourceId: 'assoc-vs-corr', page: 1, section: 'Comparison Table: Association Rules vs. Correlation Analysis' },
      blocks: [
        {
          type: 'table',
          columns: ['Aspect', 'Association rules', 'Correlation analysis'],
          rows: [
            ['Definition', 'A pattern "If X occurs, then Y is likely to occur"', 'How much two variables change together'],
            ['Data type', 'Categorical / transactional data', 'Quantitative / numerical (continuous) data'],
            ['Number of variables', 'Can involve many items at once', 'Only two variables at a time'],
            ['Relationship', 'Frequent co-occurrence, with a conditional order', 'Linear relationship (positive or inverse), no conditional order'],
            ['Evaluation metrics', 'Support, confidence, lift', 'Pearson or Spearman coefficient, from −1 to +1'],
            ['Example', 'Market basket analysis: people who buy diapers also buy beer', 'Weight gain and high blood pressure'],
          ],
        },
        {
          type: 'definitions',
          items: [
            {
              term: 'Use association rules',
              definition: 'For a large transaction database (sales, logs) to find products or events that appear together, for recommendations or cross-selling.',
            },
            {
              term: 'Use correlation analysis',
              definition: 'For continuous variables, to see whether one rises or falls regularly with the other.',
            },
          ],
        },
      ],
    },
    {
      id: 'commonly-confused',
      title: 'Commonly confused concepts',
      blocks: [
        {
          type: 'definitions',
          items: [
            {
              term: 'Support vs. confidence',
              definition: 'Support divides by **all transactions** (N); confidence divides by the transactions containing the **antecedent X**.',
            },
            {
              term: 'Frequent vs. closed vs. maximal',
              definition: 'In the lattice example: 14 frequent itemsets, of which 9 are closed and 4 are maximal.',
            },
            {
              term: 'Itemset support vs. item support',
              definition: 'In the FP-growth example, {f} and {c} each have support 4, but {f, c} has support 3.',
            },
            {
              term: 'Transaction list vs. tidset',
              definition: 'A transaction lists its items; a tidset (ECLAT) lists the transactions that contain an itemset.',
            },
            {
              term: 'Association vs. correlation',
              definition: 'Association: co-occurring items in transactions. Correlation: a linear relationship between two numerical variables.',
            },
          ],
        },
      ],
    },
  ],

  keyTakeaways: [
    'Support = frq(X, Y) / N; confidence = frq(X, Y) / frq(X).',
    'Frequent itemsets are found level by level; rules S → (I − S) are kept when support(I) / support(S) ≥ min confidence.',
    'A hash tree with h(x) = x mod 3 groups candidate itemsets so fewer candidates are checked when counting support.',
    'FP-growth scans the database twice to build the FP-tree, then mines it with conditional pattern bases.',
    'ECLAT stores each itemset with its tidset and finds larger itemsets by intersecting tidsets.',
    'Maximal frequent itemsets are a subset of the closed ones (4 of 9 in the lattice example).',
  ],

  questions: [
    {
      id: 'ch05-q01',
      difficulty: 'easy',
      question: 'For a rule X ⇒ Y, how is support calculated in the association rules exercise?',
      options: [
        { id: 'a', text: 'frq(X, Y) / N' },
        { id: 'b', text: 'frq(X, Y) / frq(X)' },
        { id: 'c', text: 'frq(X) / frq(Y)' },
        { id: 'd', text: 'frq(Y) / N' },
      ],
      correctOptionId: 'a',
      explanation:
        'Support is the frequency of transactions containing both X and Y divided by the total number of transactions N. Dividing by frq(X) instead gives confidence.',
      sourceReference: { sourceId: 'association-rules', page: 2, section: 'Association Rules Exercise' },
    },
    {
      id: 'ch05-q02',
      difficulty: 'easy',
      question: 'For a rule X ⇒ Y, how is confidence calculated?',
      options: [
        { id: 'a', text: 'frq(X, Y) / N' },
        { id: 'b', text: 'frq(X) / N' },
        { id: 'c', text: 'frq(X, Y) / frq(X)' },
        { id: 'd', text: 'frq(X, Y) / frq(Y)' },
      ],
      correctOptionId: 'c',
      explanation:
        'Confidence = frq(X, Y) / frq(X): among transactions that contain X, the share that also contain Y.',
      sourceReference: { sourceId: 'association-rules', page: 2, section: 'Association Rules Exercise' },
    },
    {
      id: 'ch05-q03',
      difficulty: 'easy',
      question: 'In the 12-transaction exercise, which item does NOT appear among the frequent 1-item sets?',
      options: [
        { id: 'a', text: 'Milk' },
        { id: 'b', text: 'Egg' },
        { id: 'c', text: 'Bread' },
        { id: 'd', text: 'Cookies' },
      ],
      correctOptionId: 'b',
      explanation:
        'Egg appears in only 3 of the 12 transactions and is dropped. Milk (9), Bread (10), Butter (10) and Cookies (5) are the frequent 1-item sets.',
      sourceReference: { sourceId: 'association-rules', page: 2, section: 'Association Rules Exercise' },
    },
    {
      id: 'ch05-q04',
      difficulty: 'medium',
      question: 'Which 2-item set has the highest frequency in the exercise?',
      options: [
        { id: 'a', text: '{Milk, Bread}' },
        { id: 'b', text: '{Milk, Butter}' },
        { id: 'c', text: '{Bread, Cookies}' },
        { id: 'd', text: '{Bread, Butter}' },
      ],
      correctOptionId: 'd',
      explanation:
        '{Bread, Butter} appears in 9 transactions. {Milk, Bread} and {Milk, Butter} appear in 7 each, and {Bread, Cookies} in 4.',
      sourceReference: { sourceId: 'association-rules', page: 3, section: 'Association Rules Exercise' },
    },
    {
      id: 'ch05-q05',
      difficulty: 'medium',
      question: 'What is the frequent 3-item set found in the exercise, and its frequency?',
      options: [
        { id: 'a', text: '{Bread, Butter, Cookies}, frequency 3' },
        { id: 'b', text: '{Milk, Bread, Butter}, frequency 6' },
        { id: 'c', text: '{Milk, Bread, Cookies}, frequency 6' },
        { id: 'd', text: '{Milk, Butter, Cookies}, frequency 7' },
      ],
      correctOptionId: 'b',
      explanation:
        '{Milk, Bread, Butter} appears in transactions 1, 4, 6, 8, 10 and 11, giving frequency 6. It is the only frequent 3-item set in the exercise.',
      sourceReference: { sourceId: 'association-rules', page: 3, section: 'Association Rules Exercise' },
    },
    {
      id: 'ch05-q06',
      difficulty: 'medium',
      question: 'For a frequent itemset I and a non-empty subset S of I, which rule do the notes form, and when is it valid?',
      options: [
        { id: 'a', text: 'S → (I − S), valid if support(I) / support(S) ≥ min_confidence' },
        { id: 'b', text: '(I − S) → S, valid if support(S) ≥ min_support' },
        { id: 'c', text: 'S → I, valid if support(S) / support(I) ≥ min_confidence' },
        { id: 'd', text: 'I → S, valid if support(I) ≥ min_confidence' },
      ],
      correctOptionId: 'a',
      explanation:
        'Each non-empty subset S becomes the antecedent and the remaining items (I − S) the consequent. Its confidence is support(I) / support(S), which must reach the minimum confidence.',
      sourceReference: { sourceId: 'association-rules', page: 4, section: 'Association Rule Mining - Subset Creation' },
    },
    {
      id: 'ch05-q07',
      difficulty: 'hard',
      question: 'In the notes, what is the confidence of the rule {Milk} → {Bread, Butter}?',
      options: [
        { id: 'a', text: '50% (6/12)' },
        { id: 'b', text: '60% (6/10)' },
        { id: 'c', text: '75% (9/12)' },
        { id: 'd', text: '66.67% (6/9)' },
      ],
      correctOptionId: 'd',
      explanation:
        'Confidence = support(Milk, Bread, Butter) / support(Milk) = (6/12) / (9/12) = 6/9 = 66.67%. 50% is the rule\'s support, and 6/10 is the confidence of {Bread} → {Milk, Butter}.',
      sourceReference: { sourceId: 'association-rules', page: 4, section: 'Association Rule Mining - Subset Creation' },
    },
    {
      id: 'ch05-q08',
      difficulty: 'medium',
      question: 'Which pairing correctly matches association rules and correlation analysis to their data?',
      options: [
        { id: 'a', text: 'Both require exactly two continuous variables' },
        { id: 'b', text: 'Association rules use numerical data; correlation uses transactions' },
        { id: 'c', text: 'Association rules use categorical/transactional data; correlation uses two numerical variables' },
        { id: 'd', text: 'Both are measured with support and confidence' },
      ],
      correctOptionId: 'c',
      explanation:
        'Association rules find co-occurring items in transactional data (measured with support, confidence, lift). Correlation measures the linear relationship between two numerical variables (Pearson or Spearman, from −1 to +1).',
      sourceReference: { sourceId: 'assoc-vs-corr', page: 1, section: 'Comparison Table: Association Rules vs. Correlation Analysis' },
    },
    {
      id: 'ch05-q09',
      difficulty: 'easy',
      question: 'With the hash function h(x) = x mod 3, which items hash to the same branch as item 4?',
      options: [
        { id: 'a', text: '2 and 8' },
        { id: 'b', text: '1 and 7' },
        { id: 'c', text: '3 and 9' },
        { id: 'd', text: '5 and 6' },
      ],
      correctOptionId: 'b',
      explanation: '4 mod 3 = 1, as do 1 and 7. Items 2, 5, 8 give 2, and items 3, 6, 9 give 0.',
      sourceReference: { sourceId: 'hash-tree', page: 1, section: 'Pattern Mining- Hash Tree Construction' },
    },
    {
      id: 'ch05-q10',
      difficulty: 'medium',
      question: 'When is a leaf node of the hash tree split?',
      options: [
        { id: 'a', text: 'When its number of candidate itemsets exceeds the maximum leaf size' },
        { id: 'b', text: 'Whenever a new candidate is inserted' },
        { id: 'c', text: 'When it contains itemsets with different first items' },
        { id: 'd', text: 'Only after support counting has finished' },
      ],
      correctOptionId: 'a',
      explanation:
        'The key points state: split a leaf only when its number of candidates exceeds the specified maximum leaf size (3 in the example), hashing on the next item position.',
      sourceReference: { sourceId: 'hash-tree', page: 4, section: 'Key points for students' },
    },
    {
      id: 'ch05-q11',
      difficulty: 'medium',
      question: 'How many subsets of size 3 does the transaction t = {1, 2, 3, 5, 6} have?',
      options: [
        { id: 'a', text: '5' },
        { id: 'b', text: '6' },
        { id: 'c', text: '8' },
        { id: 'd', text: '10' },
      ],
      correctOptionId: 'd',
      explanation:
        'The notes enumerate 123, 125, 126, 135, 136, 156, 235, 236, 256 and 356: ten subsets, which matches choosing 3 of 5 items.',
      sourceReference: { sourceId: 'hash-tree', page: 5, section: 'Subsets of 3 items' },
    },
    {
      id: 'ch05-q12',
      difficulty: 'easy',
      question: 'According to the FP-growth steps, how many times is the database scanned to build the FP-tree?',
      options: [
        { id: 'a', text: 'Once' },
        { id: 'b', text: 'Once for every frequent item' },
        { id: 'c', text: 'Twice' },
        { id: 'd', text: 'Once for every itemset size' },
      ],
      correctOptionId: 'c',
      explanation:
        'Step 1 scans the database once to find frequent 1-itemsets; step 3 scans it again to construct the FP-tree.',
      sourceReference: { sourceId: 'fp-growth', page: 1, section: 'FP Growth Approach' },
    },
    {
      id: 'ch05-q13',
      difficulty: 'medium',
      question: 'Transaction 200 is {a, b, c, f, l, m, o}. Why are l and o removed before the FP-tree is built?',
      options: [
        { id: 'a', text: 'They appear only in transaction 200' },
        { id: 'b', text: 'They are infrequent: their support (2) is below the minimum support count of 3' },
        { id: 'c', text: 'They come last in alphabetical order' },
        { id: 'd', text: 'They already appear in another branch of the tree' },
      ],
      correctOptionId: 'b',
      explanation:
        'Items with support below 3 are removed before building the tree. l appears in transactions 200 and 500, and o in 200 and 300: support 2 each.',
      sourceReference: { sourceId: 'fp-growth', page: 4, section: 'Step 4: Filter and reorder each transaction' },
    },
    {
      id: 'ch05-q14',
      difficulty: 'hard',
      question: 'In the FP-tree, what does the node c:3 directly below f:4 mean?',
      options: [
        { id: 'a', text: 'Three transactions contain the prefix f, c' },
        { id: 'b', text: 'Item c appears in exactly three transactions overall' },
        { id: 'c', text: 'Three transactions contain c but not f' },
        { id: 'd', text: 'c is the third item in the F-list' },
      ],
      correctOptionId: 'a',
      explanation:
        'Counts on a path are shared-prefix counts: c:3 under f means three transactions contain f followed by c. Item c appears in four transactions overall; the fourth is on the separate path Root → c:1.',
      sourceReference: { sourceId: 'fp-growth', page: 4, section: 'Step 5: Construct the FP-tree' },
    },
    {
      id: 'ch05-q15',
      difficulty: 'hard',
      question: 'The conditional pattern base for suffix p is {f, c, a, m}: 2 and {c, b}: 1. Which frequent patterns end in p?',
      options: [
        { id: 'a', text: '{p} only' },
        { id: 'b', text: '{f, p} and {c, p}' },
        { id: 'c', text: '{f, c, a, m, p}' },
        { id: 'd', text: '{p} and {c, p}' },
      ],
      correctOptionId: 'd',
      explanation:
        'Only c reaches the minimum support count of 3 in p\'s conditional pattern base (2 + 1 = 3); f, a, m and b appear fewer than 3 times. So the patterns are {p}: 3 and {c, p}: 3.',
      sourceReference: { sourceId: 'fp-growth', page: 5, section: 'Step 6: Mine the FP-tree using conditional pattern bases' },
    },
    {
      id: 'ch05-q16',
      difficulty: 'medium',
      question: 'How many frequent itemsets does FP-growth find in the TID 100-500 example (min support count 3)?',
      options: [
        { id: 'a', text: '6' },
        { id: 'b', text: '12' },
        { id: 'c', text: '18' },
        { id: 'd', text: '24' },
      ],
      correctOptionId: 'c',
      explanation:
        'The final answer lists 18 frequent itemsets: 6 single items, 7 pairs, 4 triples and 1 four-item set ({f, c, a, m}).',
      sourceReference: { sourceId: 'fp-growth', page: 7, section: 'Step 7: Final answer' },
    },
    {
      id: 'ch05-q17',
      difficulty: 'medium',
      question: 'In the second FP-growth example, the conditional FP-tree for Y is {K: 3}. Which frequent pattern is generated?',
      options: [
        { id: 'a', text: '{K, E, Y: 3}' },
        { id: 'b', text: '{K, Y: 3}' },
        { id: 'c', text: '{Y: 5}' },
        { id: 'd', text: '{K, M, Y: 1}' },
      ],
      correctOptionId: 'b',
      explanation:
        'Pairing Y with the items of its conditional FP-tree gives {K, Y} with support 3. E, M and O each appear only twice in Y\'s conditional pattern base, so they are not frequent there.',
      sourceReference: { sourceId: 'fp-examples', section: 'Frequent Pattern (FP) Growth Algorithm Association Rule Mining' },
    },
    {
      id: 'ch05-q18',
      difficulty: 'easy',
      question: 'What does ECLAT stand for?',
      options: [
        { id: 'a', text: 'Equivalence Class Clustering and bottom-up Lattice Traversal' },
        { id: 'b', text: 'Extract, Clean, Load And Transform' },
        { id: 'c', text: 'Efficient Candidate Listing for Association Trees' },
        { id: 'd', text: 'Equal Count Lattice Association Technique' },
      ],
      correctOptionId: 'a',
      explanation: 'The notes define ECLAT as Equivalence Class Clustering and bottom-up Lattice Traversal, a popular association rule mining method.',
      sourceReference: { sourceId: 'eclat', page: 1, section: 'ECLAT - Association Rule Mining' },
    },
    {
      id: 'ch05-q19',
      difficulty: 'hard',
      question:
        'In the ECLAT example, Bread has tidset {T1, T4, T5, T7, T8, T9} and Butter has {T1, T2, T3, T4, T6, T8, T9}. What is the tidset of {Bread, Butter}?',
      options: [
        { id: 'a', text: '{T1, T2, T3, T4, T5, T6, T7, T8, T9}' },
        { id: 'b', text: '{T5, T7}' },
        { id: 'c', text: '{T2, T3, T6}' },
        { id: 'd', text: '{T1, T4, T8, T9}' },
      ],
      correctOptionId: 'd',
      explanation:
        'An itemset\'s tidset is the intersection of its items\' tidsets: the transactions containing both Bread and Butter are T1, T4, T8 and T9, so its support is 4.',
      sourceReference: { sourceId: 'eclat', page: 1, section: 'ECLAT - Association Rule Mining' },
    },
    {
      id: 'ch05-q20',
      difficulty: 'medium',
      question: 'In the lattice example (minimum support count 2), how many maximal frequent itemsets do the notes identify?',
      options: [
        { id: 'a', text: '14' },
        { id: 'b', text: '9' },
        { id: 'c', text: '4' },
        { id: 'd', text: '1' },
      ],
      correctOptionId: 'c',
      explanation:
        'The notes report 14 frequent itemsets, 9 closed frequent itemsets, and 4 maximal frequent itemsets (CE, DE, ABC and ACD, marked "closed and maximal").',
      sourceReference: { sourceId: 'fp-examples', section: 'Closed And Maximal Frequent Itemsets' },
    },
  ],
};
