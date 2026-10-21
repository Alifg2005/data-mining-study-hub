import type { Chapter } from '../../types/content';

/**
 * Chapter 2: Getting to Know Your Data
 * Source: Chapter 2 lecture notes PDF, 4 pages (file path in src/data/source-manifest.ts)
 *   p.1  1. Data Types (type/subtype table, Interval, attribute tree)
 *   p.2  2. Attributes & Variables (measurement table, symmetric/asymmetric, mini-dataset, class activity)
 *   p.3  3. Statistical Measures for Data Analysis
 *   p.4  4. Major Data Mining Tasks, How the tasks differ, Most famous tasks
 */
export const chapter02: Chapter = {
  id: 'chapter-02',
  number: 2,
  title: 'Getting to Know Your Data',
  description:
    'Attribute types and measurement scales, descriptive statistics for understanding data, and how the major data mining tasks differ.',
  sources: [{ id: 'notes', title: 'Notes', unit: 'page' }],

  learningObjectives: [
    'Classify attributes as numerical (discrete, continuous) or categorical (nominal, binary, ordinal).',
    'Distinguish nominal, ordinal, interval, and ratio scales by order, meaningful difference, and true zero.',
    'Explain symmetric and asymmetric binary attributes.',
    'Choose and interpret basic statistical measures of center, spread, and relationship.',
    'Match each major data mining task to its input, goal, and output.',
  ],

  reviewSections: [
    {
      id: 'data-types',
      title: 'Data types',
      source: { page: 1, section: '1. Data Types' },
      blocks: [
        {
          type: 'paragraph',
          text: 'Before applying a mining algorithm, we need to understand **what each variable represents** and **what mathematical operations make sense** for it.',
        },
        {
          type: 'tree',
          root: {
            label: 'Types of attributes',
            children: [
              { label: 'Numerical', children: [{ label: 'Discrete' }, { label: 'Continuous' }] },
              { label: 'Categorical', children: [{ label: 'Nominal' }, { label: 'Binary' }, { label: 'Ordinal' }] },
            ],
          },
        },
        {
          type: 'table',
          columns: ['Type', 'Subtype', 'Description', 'Example'],
          rowHeaderColumn: 1,
          rows: [
            ['Numerical', 'Discrete', 'Countable, distinct values.', 'Number of students, number of sales.'],
            ['Numerical', 'Continuous (Ratio)', 'Measurable values with a meaningful zero point.', 'Height, weight, income, distance.'],
            ['Categorical', 'Nominal', 'Categories without any order.', 'Gender, color, city name.'],
            ['Categorical', 'Binary', 'Two distinct categories.', 'Yes/No, Male/Female, True/False.'],
            ['Categorical', 'Ordinal', 'Categories with a meaningful order but unknown differences.', 'Education level, rating scale (1 to 5).'],
          ],
        },
        {
          type: 'definitions',
          items: [
            {
              term: 'Interval',
              definition: 'Ordered numeric values with **meaningful differences**, but **no true zero**.',
            },
          ],
        },
      ],
    },
    {
      id: 'attributes-and-scales',
      title: 'Attributes and measurement scales',
      source: { page: 2, section: '2. Attributes & Variables' },
      blocks: [
        {
          type: 'table',
          columns: ['Type', 'Order?', 'Meaningful difference?', 'True zero?', 'Typical example'],
          rows: [
            ['Nominal', '✗', '✗', '✗', 'Color, major, country'],
            ['Ordinal', '✓', 'Not necessarily', '✗', 'Rating, rank, education level'],
            ['Interval', '✓', '✓', '✗', '°C temperature, calendar year'],
            ['Ratio', '✓', '✓', '✓', 'Age, salary, quantity'],
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'Read the table left to right',
          text: 'Each scale adds one property: nominal has none, ordinal adds **order**, interval adds **meaningful difference**, and ratio adds a **true zero**.',
        },
        {
          type: 'definitions',
          items: [
            {
              term: 'Symmetric binary',
              definition: 'Both states matter equally.',
            },
            {
              term: 'Asymmetric binary',
              definition: 'One state is more important than the other.',
            },
          ],
        },
      ],
    },
    {
      id: 'mini-dataset',
      title: 'Example: mini-dataset',
      source: { page: 2, section: 'Example: mini-Dataset' },
      blocks: [
        {
          type: 'table',
          columns: ['Student', 'Major', 'Study Hours', 'Courses', 'Satisfaction', 'Passed'],
          rows: [
            ['S01', 'CS', '12.5', '5', 'Excellent', 'Yes'],
            ['S02', 'IS', '8.0', '4', 'Good', 'Yes'],
            ['S03', 'CS', '3.5', '5', 'Fair', 'No'],
          ],
        },
        {
          type: 'table',
          caption: 'Applying the data type table to each attribute',
          columns: ['Attribute', 'Type', 'Why'],
          rows: [
            ['Major', 'Categorical: nominal', 'Categories (CS, IS) without any order.'],
            ['Study Hours', 'Numerical: continuous (ratio)', 'Measurable value with a meaningful zero.'],
            ['Courses', 'Numerical: discrete', 'A countable number of courses.'],
            ['Satisfaction', 'Categorical: ordinal', 'Fair < Good < Excellent, but the gaps are unknown.'],
            ['Passed', 'Categorical: binary', 'Two distinct categories: Yes / No.'],
          ],
        },
        {
          type: 'callout',
          tone: 'note',
          title: 'Class activity',
          text: 'The notes list **Weka** and **MS Excel** as tools for the class activity on this dataset.',
        },
      ],
    },
    {
      id: 'statistical-measures',
      title: 'Statistical measures for data analysis',
      source: { page: 3, section: '3. Statistical Measures for Data Analysis' },
      blocks: [
        {
          type: 'paragraph',
          text: 'Descriptive statistics help us understand the **center**, **spread**, **shape**, and **relationships** within a dataset.',
        },
        {
          type: 'definitions',
          items: [
            { term: 'Mean', definition: 'The arithmetic average. **Sensitive to extreme values.**' },
            { term: 'Median', definition: 'The middle value after sorting. **More robust to outliers.**' },
            { term: 'Mode', definition: 'The most frequently occurring value.' },
            { term: 'Range', definition: 'A simple measure of spread.' },
            { term: 'Variance', definition: 'Measures the average squared deviation from the mean.' },
            { term: 'Standard deviation', definition: 'Expresses spread in the **original unit**.' },
            { term: 'Quartiles & IQR', definition: 'Useful for **robust** spread measurement and **outlier detection**.' },
            {
              term: 'Correlation',
              definition: 'Measures the **strength and direction** of **linear** association. **Correlation does not imply causation.**',
            },
          ],
        },
        {
          type: 'example',
          title: 'Worked examples from the notes',
          items: ['Data: 2, 3, 4, 5, 100 → **Median = 4**', 'Data: 2, 3, 3, 4 → **Mode = 3**', 'Variance example data: 1, 2, 3, 3, 4'],
        },
        {
          type: 'callout',
          tone: 'supplemental',
          title: 'Supplemental calculations (not given in the notes)',
          text: 'For 2, 3, 4, 5, 100 the **mean is 22.8**, far above the median of 4: the single extreme value 100 pulls the mean, which shows why the median is more robust. For 1, 2, 3, 3, 4 the mean is 2.6 and the sum of squared deviations is 5.2, so the **population variance is 1.04** (dividing by n = 5) and the **sample variance is 1.3** (dividing by n − 1 = 4). Ask your instructor which formula the course uses.',
        },
      ],
    },
    {
      id: 'major-tasks',
      title: 'Major data mining tasks',
      source: { page: 4, section: '4. Major Data Mining Tasks' },
      blocks: [
        {
          type: 'table',
          columns: ['Task', 'Description', 'Application'],
          rows: [
            ['Classification', 'Assign objects to predefined classes.', 'Predict whether a customer will churn: Yes / No.'],
            ['Clustering', 'Group similar objects without predefined labels.', 'Segment customers by purchasing behavior.'],
            ['Association Analysis', 'Discover items or events that frequently occur together.', 'Customers who buy bread often buy milk.'],
            ['Outlier Detection', 'Identify observations that are unusually different from the rest.', 'Detect unusual credit-card transactions.'],
            ['Prediction / Regression', 'Estimate a numeric target using observed attributes.', 'Predict house price from area, location, and age.'],
            ['Sequential Pattern Mining', 'Discover recurring patterns ordered over time.', '"Search → product view → purchase."'],
          ],
        },
      ],
    },
    {
      id: 'how-tasks-differ',
      title: 'How the tasks differ',
      source: { page: 4, section: 'How the tasks differ' },
      blocks: [
        {
          type: 'table',
          columns: ['Task', 'Input / Goal', 'Output'],
          rows: [
            ['Classification', 'Known class labels', 'Predicted category'],
            ['Clustering', 'No labels', 'Groups / clusters'],
            ['Association', 'Transactions / events', 'Rules or co-occurrence patterns'],
            ['Outlier Detection', 'Normal + unusual observations', 'Anomaly score / flagged records'],
            ['Regression', 'Numeric target', 'Predicted numeric value'],
          ],
        },
        {
          type: 'comparison',
          items: [
            { title: 'Predictive', points: ['Classification', 'Prediction'] },
            { title: 'Descriptive', points: ['Association Rules', 'Clustering', 'Outlier Analysis'] },
          ],
        },
        {
          type: 'callout',
          tone: 'note',
          text: '**Classification** and **Clustering** are highlighted in the notes\' list of the most famous data mining tasks.',
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
              term: 'Interval vs. ratio',
              definition:
                'Both have order and meaningful differences. Only **ratio** has a **true zero** (age, salary). °C temperature and calendar year are interval.',
            },
            {
              term: 'Ordinal vs. interval',
              definition:
                'Ordinal categories are ordered, but the differences are **not necessarily** meaningful (a rating of 4 vs. 5). Interval differences are meaningful.',
            },
            {
              term: 'Classification vs. regression',
              definition:
                'Both are predictive. Classification outputs a **predicted category**; regression outputs a **predicted numeric value**.',
            },
            {
              term: 'Classification vs. clustering',
              definition: 'Classification needs **known class labels**; clustering works with **no labels** and outputs groups.',
            },
            {
              term: 'Mean vs. median',
              definition: 'The mean is sensitive to extreme values; the median is more robust to outliers.',
            },
            {
              term: 'Correlation vs. causation',
              definition: 'A strong correlation shows a linear association. It does not prove that one variable causes the other.',
            },
          ],
        },
      ],
    },
  ],

  keyTakeaways: [
    'Know what each variable represents and which operations make sense for it before mining.',
    'Numerical attributes are discrete or continuous; categorical attributes are nominal, binary, or ordinal.',
    'Nominal → ordinal → interval → ratio: each scale adds order, then meaningful difference, then a true zero.',
    'Median and IQR are robust to outliers; the mean is sensitive to extreme values.',
    'Correlation measures linear association and does not imply causation.',
    'Match tasks by output: category (classification), groups (clustering), rules (association), anomalies (outlier detection), numeric value (regression), ordered patterns (sequential pattern mining).',
  ],

  questions: [
    {
      id: 'ch02-q01',
      difficulty: 'easy',
      question: '"Number of students in a class" is best classified as which type of attribute?',
      options: [
        { id: 'a', text: 'Numerical: continuous' },
        { id: 'b', text: 'Categorical: ordinal' },
        { id: 'c', text: 'Numerical: discrete' },
        { id: 'd', text: 'Categorical: nominal' },
      ],
      correctOptionId: 'c',
      explanation:
        'Discrete attributes have countable, distinct values. You count students in whole numbers; you do not measure them on a continuous scale.',
      sourceReference: { page: 1, section: '1. Data Types' },
    },
    {
      id: 'ch02-q02',
      difficulty: 'easy',
      question: 'Height, weight, income, and distance are examples of which subtype?',
      options: [
        { id: 'a', text: 'Continuous (ratio): measurable values with a meaningful zero point' },
        { id: 'b', text: 'Discrete: countable, distinct values' },
        { id: 'c', text: 'Ordinal: ordered categories with unknown differences' },
        { id: 'd', text: 'Binary: two distinct categories' },
      ],
      correctOptionId: 'a',
      explanation:
        'These values are measured rather than counted, and zero means "none" (zero distance, zero income). That makes them continuous ratio attributes.',
      sourceReference: { page: 1, section: '1. Data Types' },
    },
    {
      id: 'ch02-q03',
      difficulty: 'easy',
      question: 'Which of these attributes is nominal?',
      options: [
        { id: 'a', text: 'Education level' },
        { id: 'b', text: 'Rating on a scale from 1 to 5' },
        { id: 'c', text: 'Annual income' },
        { id: 'd', text: 'City name' },
      ],
      correctOptionId: 'd',
      explanation:
        'Nominal attributes are categories without any order, such as gender, color, or city name. Education level and ratings are ordered (ordinal), and income is numerical.',
      sourceReference: { page: 1, section: '1. Data Types' },
    },
    {
      id: 'ch02-q04',
      difficulty: 'medium',
      question: 'Why is "education level" classified as ordinal rather than interval?',
      options: [
        { id: 'a', text: 'Because it has no natural order' },
        { id: 'b', text: 'Because its categories have a meaningful order but the differences between them are unknown' },
        { id: 'c', text: 'Because it has exactly two possible values' },
        { id: 'd', text: 'Because it has a true zero point' },
      ],
      correctOptionId: 'b',
      explanation:
        'Education levels can be ranked, but the "distance" between levels is not a measurable quantity. Ordinal means order without meaningful differences; interval requires meaningful differences.',
      sourceReference: { page: 1, section: '1. Data Types' },
    },
    {
      id: 'ch02-q05',
      difficulty: 'medium',
      question: 'Temperature measured in °C belongs to which scale?',
      options: [
        { id: 'a', text: 'Interval' },
        { id: 'b', text: 'Ratio' },
        { id: 'c', text: 'Ordinal' },
        { id: 'd', text: 'Nominal' },
      ],
      correctOptionId: 'a',
      explanation:
        'Temperatures in °C are ordered and their differences are meaningful, but 0 °C does not mean "no temperature". Ordered, meaningful differences, no true zero: that is interval.',
      sourceReference: { page: 2, section: '2. Attributes & Variables' },
    },
    {
      id: 'ch02-q06',
      difficulty: 'medium',
      question: 'Which property does a ratio attribute have that an interval attribute does not?',
      options: [
        { id: 'a', text: 'A meaningful order between values' },
        { id: 'b', text: 'Meaningful differences between values' },
        { id: 'c', text: 'Exactly two distinct categories' },
        { id: 'd', text: 'A true zero point' },
      ],
      correctOptionId: 'd',
      explanation:
        'Interval and ratio both have order and meaningful differences. Only ratio has a true zero, which is why an age of 0 or a salary of 0 means "none".',
      sourceReference: { page: 2, section: '2. Attributes & Variables' },
    },
    {
      id: 'ch02-q07',
      difficulty: 'medium',
      question: 'Which row of the measurement-scale table is correct?',
      options: [
        { id: 'a', text: 'Ordinal: order ✓, meaningful difference ✓, true zero ✓' },
        { id: 'b', text: 'Nominal: order ✗, meaningful difference ✗, true zero ✗' },
        { id: 'c', text: 'Interval: order ✓, meaningful difference ✓, true zero ✓' },
        { id: 'd', text: 'Ratio: order ✓, meaningful difference ✗, true zero ✓' },
      ],
      correctOptionId: 'b',
      explanation:
        'Nominal has none of the three properties. Ordinal has order only (differences "not necessarily" meaningful), interval lacks a true zero, and ratio has all three.',
      sourceReference: { page: 2, section: '2. Attributes & Variables' },
    },
    {
      id: 'ch02-q08',
      difficulty: 'medium',
      question: 'When is a binary attribute called asymmetric?',
      options: [
        { id: 'a', text: 'When both of its states matter equally' },
        { id: 'b', text: 'When it has more than two possible states' },
        { id: 'c', text: 'When one of its states is more important than the other' },
        { id: 'd', text: 'When its values are ordered with a true zero' },
      ],
      correctOptionId: 'c',
      explanation:
        'A binary attribute is symmetric when both states matter equally and asymmetric when one state carries more importance.',
      sourceReference: { page: 2, section: '2. Attributes & Variables' },
    },
    {
      id: 'ch02-q09',
      difficulty: 'medium',
      question: 'In the mini-dataset, "Satisfaction" takes the values Excellent, Good, and Fair. What type of attribute is it?',
      options: [
        { id: 'a', text: 'Nominal' },
        { id: 'b', text: 'Ordinal' },
        { id: 'c', text: 'Ratio' },
        { id: 'd', text: 'Binary' },
      ],
      correctOptionId: 'b',
      explanation:
        'The values have a clear order (Fair < Good < Excellent), but the gap between them is not measurable. That matches ordinal: categories with a meaningful order but unknown differences.',
      sourceReference: { page: 2, section: 'Example: mini-Dataset' },
    },
    {
      id: 'ch02-q10',
      difficulty: 'hard',
      question: 'In the mini-dataset, how should "Study Hours" (12.5, 8.0, 3.5) and "Courses" (5, 4, 5) be classified?',
      options: [
        { id: 'a', text: 'Study Hours: continuous; Courses: discrete' },
        { id: 'b', text: 'Study Hours: discrete; Courses: continuous' },
        { id: 'c', text: 'Both are ordinal' },
        { id: 'd', text: 'Study Hours: interval; Courses: nominal' },
      ],
      correctOptionId: 'a',
      explanation:
        'Study hours are measured and can take fractional values with a meaningful zero (continuous ratio). The number of courses is counted in whole numbers (discrete).',
      sourceReference: { page: 2, section: 'Example: mini-Dataset' },
    },
    {
      id: 'ch02-q11',
      difficulty: 'easy',
      question: 'What is the median of the data 2, 3, 4, 5, 100?',
      options: [
        { id: 'a', text: '22.8' },
        { id: 'b', text: '5' },
        { id: 'c', text: '100' },
        { id: 'd', text: '4' },
      ],
      correctOptionId: 'd',
      explanation:
        'The median is the middle value after sorting. With five sorted values, the third one (4) is the median. 22.8 is the mean, which the extreme value 100 inflates.',
      sourceReference: { page: 3, section: '3. Statistical Measures for Data Analysis' },
    },
    {
      id: 'ch02-q12',
      difficulty: 'medium',
      question: 'For the data 2, 3, 4, 5, 100, why is the median a better summary of the center than the mean?',
      options: [
        { id: 'a', text: 'Because the median is always larger than the mean' },
        { id: 'b', text: 'Because the median measures spread in the original unit' },
        { id: 'c', text: 'Because the median is more robust to outliers, while the mean is sensitive to extreme values' },
        { id: 'd', text: 'Because the median is the most frequently occurring value' },
      ],
      correctOptionId: 'c',
      explanation:
        'The value 100 is an outlier that pulls the mean far upward, but it does not change the middle value. The most frequent value is the mode, not the median.',
      sourceReference: { page: 3, section: '3. Statistical Measures for Data Analysis' },
    },
    {
      id: 'ch02-q13',
      difficulty: 'medium',
      question: 'Which measure expresses the spread of data in the original unit of the data?',
      options: [
        { id: 'a', text: 'Standard deviation' },
        { id: 'b', text: 'Variance' },
        { id: 'c', text: 'Correlation' },
        { id: 'd', text: 'Mode' },
      ],
      correctOptionId: 'a',
      explanation:
        'Variance averages squared deviations, so its unit is squared. Taking its square root gives the standard deviation, which is back in the original unit.',
      sourceReference: { page: 3, section: '3. Statistical Measures for Data Analysis' },
    },
    {
      id: 'ch02-q14',
      difficulty: 'medium',
      question: 'Which statistical measure do the notes describe as useful for robust spread measurement and outlier detection?',
      options: [
        { id: 'a', text: 'Mean' },
        { id: 'b', text: 'Range' },
        { id: 'c', text: 'Quartiles and the interquartile range (IQR)' },
        { id: 'd', text: 'Mode' },
      ],
      correctOptionId: 'c',
      explanation:
        'Quartiles and the IQR describe the middle of the distribution, so a few extreme values barely affect them. The range is a simple spread measure but is driven by the extremes.',
      sourceReference: { page: 3, section: '3. Statistical Measures for Data Analysis' },
    },
    {
      id: 'ch02-q15',
      difficulty: 'medium',
      question: 'Two attributes in a dataset show a strong correlation. What can you conclude?',
      options: [
        { id: 'a', text: 'One attribute definitely causes the other' },
        { id: 'b', text: 'Both attributes must be categorical' },
        { id: 'c', text: 'The attributes have the same mean' },
        { id: 'd', text: 'They have a strong linear association, but this does not prove causation' },
      ],
      correctOptionId: 'd',
      explanation:
        'Correlation measures the strength and direction of linear association. The notes stress that correlation does not imply causation.',
      sourceReference: { page: 3, section: '3. Statistical Measures for Data Analysis' },
    },
    {
      id: 'ch02-q16',
      difficulty: 'easy',
      question: 'A telecom company wants to predict whether each customer will churn (Yes / No). Which task is this?',
      options: [
        { id: 'a', text: 'Clustering' },
        { id: 'b', text: 'Classification' },
        { id: 'c', text: 'Regression' },
        { id: 'd', text: 'Association analysis' },
      ],
      correctOptionId: 'b',
      explanation:
        'Churn Yes/No is a predefined class. Assigning objects to predefined classes is classification, and its output is a predicted category.',
      sourceReference: { page: 4, section: '4. Major Data Mining Tasks' },
    },
    {
      id: 'ch02-q17',
      difficulty: 'medium',
      question: 'Predicting a house price from its area, location, and age is an example of which task, and what is its output?',
      options: [
        { id: 'a', text: 'Classification; a predicted category' },
        { id: 'b', text: 'Clustering; groups of similar houses' },
        { id: 'c', text: 'Association analysis; co-occurrence rules' },
        { id: 'd', text: 'Prediction / regression; a predicted numeric value' },
      ],
      correctOptionId: 'd',
      explanation:
        'Price is a numeric target. Regression estimates a numeric target from observed attributes and outputs a predicted numeric value.',
      sourceReference: { page: 4, section: 'How the tasks differ' },
    },
    {
      id: 'ch02-q18',
      difficulty: 'easy',
      question: '"Customers who buy bread often buy milk" is a typical result of which task?',
      options: [
        { id: 'a', text: 'Association analysis' },
        { id: 'b', text: 'Outlier detection' },
        { id: 'c', text: 'Classification' },
        { id: 'd', text: 'Sequential pattern mining' },
      ],
      correctOptionId: 'a',
      explanation:
        'Association analysis discovers items or events that frequently occur together in transactions, producing rules or co-occurrence patterns. It does not depend on time order.',
      sourceReference: { page: 4, section: '4. Major Data Mining Tasks' },
    },
    {
      id: 'ch02-q19',
      difficulty: 'medium',
      question: 'A bank wants to detect unusual credit-card transactions. Which task fits, and what does it output?',
      options: [
        { id: 'a', text: 'Clustering; groups of customers' },
        { id: 'b', text: 'Regression; a predicted numeric transaction amount' },
        { id: 'c', text: 'Outlier detection; an anomaly score or flagged records' },
        { id: 'd', text: 'Association analysis; rules about co-purchased items' },
      ],
      correctOptionId: 'c',
      explanation:
        'Outlier detection identifies observations that are unusually different from the rest. Its output is an anomaly score or a set of flagged records.',
      sourceReference: { page: 4, section: 'How the tasks differ' },
    },
    {
      id: 'ch02-q20',
      difficulty: 'hard',
      question:
        'An online store finds that many users follow the path "search → product view → purchase". Which task discovers this kind of pattern?',
      options: [
        { id: 'a', text: 'Association analysis' },
        { id: 'b', text: 'Sequential pattern mining' },
        { id: 'c', text: 'Clustering' },
        { id: 'd', text: 'Classification' },
      ],
      correctOptionId: 'b',
      explanation:
        'The pattern is a recurring series of events ordered over time, which is what sequential pattern mining discovers. Association analysis finds items that occur together without regard to order.',
      sourceReference: { page: 4, section: '4. Major Data Mining Tasks' },
    },
  ],
};
