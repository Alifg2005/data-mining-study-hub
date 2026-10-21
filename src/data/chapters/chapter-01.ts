import type { Chapter } from '../../types/content';

/**
 * Chapter 1: Introduction to Data Mining
 * Source: Chapter 1 lecture notes PDF, 5 pages (file path in src/data/source-manifest.ts)
 *   p.1  What is Data Mining?, The KDD Process, Data Mining Tasks
 *   p.2  Diversity of Data Types, Interdisciplinary Nature & Society, Summary
 *   p.3  Most famous data mining Functions (list + taxonomy diagram)
 *   p.4  Classification (direct marketing, tenure activity)
 *   p.5  Clustering (market segmentation)
 */
export const chapter01: Chapter = {
  id: 'chapter-01',
  number: 1,
  title: 'Introduction to Data Mining',
  description:
    'What data mining is, the KDD process, descriptive vs. predictive tasks, and the core functions of classification and clustering.',
  sources: [{ id: 'notes', title: 'Notes', unit: 'page' }],

  learningObjectives: [
    'Define data mining and recognize its alternative names, including KDD.',
    'Describe the stages of the KDD process and why it is interactive and iterative.',
    'Distinguish descriptive mining tasks from predictive mining tasks.',
    'Classify the most famous data mining functions as predictive or descriptive.',
    'Explain how classification builds a model from labeled training data.',
    'Explain how clustering groups unlabeled objects by similarity.',
    'Identify the disciplines, data types, challenges, and privacy concerns of data mining.',
  ],

  reviewSections: [
    {
      id: 'what-is-data-mining',
      title: 'What is data mining?',
      source: { page: 1, section: '1) What is Data Mining?' },
      blocks: [
        {
          type: 'paragraph',
          text: 'Data mining is also described as **knowledge discovery from data**. The notes give two definitions:',
        },
        {
          type: 'list',
          items: [
            'Extraction of **interesting** (non-trivial, implicit, previously unknown and potentially useful) **patterns** or **knowledge** from huge amounts of data.',
            'The process of discovering **interesting patterns, models, and knowledge** in large data sets.',
          ],
        },
        {
          type: 'definitions',
          items: [
            { term: 'Non-trivial', definition: 'Not obvious; requires real analysis to uncover.' },
            { term: 'Implicit', definition: 'Hidden inside the data rather than stated explicitly.' },
            { term: 'Previously unknown', definition: 'New knowledge, not something already known.' },
            { term: 'Potentially useful', definition: 'Can support decisions or actions.' },
          ],
        },
        {
          type: 'list',
          title: 'Alternative names (a misnomer?)',
          items: [
            'Knowledge discovery (mining) from data (**KDD**)',
            'Knowledge extraction',
            'Data/pattern analysis',
            'Business intelligence, etc.',
          ],
        },
        {
          type: 'callout',
          tone: 'supplemental',
          title: 'Why "a misnomer?" (supplemental)',
          text: 'The notes only pose the question. The usual textbook explanation: we mine data to extract **knowledge**, so "knowledge mining from data" would describe the goal more precisely, which is why names like KDD are also used.',
        },
      ],
    },
    {
      id: 'kdd-process',
      title: 'The KDD process',
      source: { page: 1, section: '2) Process of Data Mining (The KDD Process)' },
      blocks: [
        {
          type: 'paragraph',
          text: 'Data mining is essentially a **process** of data-driven extraction of not-so-obvious but useful information from large databases. The entire process is **interactive** and **iterative**: the analyst takes part throughout, and steps can be revisited.',
        },
        {
          type: 'process',
          title: 'Knowledge Discovery Process',
          steps: [
            {
              title: 'Data preparation',
              description:
                'Data cleaning, data integration, data transformation, and data selection. Data sources are cleaned and integrated (for example into a data warehouse), then the relevant data is selected.',
            },
            { title: 'Data mining', description: 'Applying methods to the prepared data to discover patterns.' },
            { title: 'Pattern/model evaluation', description: 'Identifying which discovered patterns are truly interesting.' },
            { title: 'Knowledge presentation', description: 'Presenting the discovered knowledge to the user.' },
          ],
        },
        {
          type: 'callout',
          tone: 'note',
          text: 'In the KDD diagram, data mining is **one step** inside the larger knowledge discovery process, and feedback arrows lead back to earlier steps. That is what "iterative" means here.',
        },
      ],
    },
    {
      id: 'data-mining-tasks',
      title: 'Data mining tasks: descriptive vs. predictive',
      source: { page: 1, section: '3) Data Mining Tasks' },
      blocks: [
        {
          type: 'paragraph',
          text: 'Data mining tasks are the kind of **data patterns that can be mined**. In general, they are classified into two categories.',
        },
        {
          type: 'comparison',
          items: [
            {
              title: 'Descriptive',
              tag: 'Characterize',
              description: 'Characterize the general **properties** of the data in a target data set.',
              points: ['Association rules', 'Sequence discovery', 'Clustering', 'Summarization'],
            },
            {
              title: 'Predictive',
              tag: 'Predict',
              description:
                'Perform **induction** (inference) on the **current** data in order to predict **values** of **new** data.',
              points: ['Classification', 'Regression', 'Time series analysis', 'Prediction'],
            },
          ],
        },
        {
          type: 'paragraph',
          text: 'Data mining **functions** are used to specify the kinds of patterns to be found in data mining tasks.',
        },
      ],
    },
    {
      id: 'data-mining-functions',
      title: 'Most famous data mining functions',
      source: { page: 3, section: 'Most famous data mining Functions' },
      blocks: [
        {
          type: 'paragraph',
          text: 'These functions answer the question **"What kinds of patterns can be mined?"**',
        },
        {
          type: 'table',
          columns: ['Function', 'Category'],
          rows: [
            ['Classification', 'Predictive'],
            ['Prediction', 'Predictive'],
            ['Association Rules', 'Descriptive'],
            ['Clustering', 'Descriptive'],
            ['Outlier Analysis', 'Descriptive'],
          ],
        },
        {
          type: 'tree',
          root: {
            label: 'Data mining',
            children: [
              {
                label: 'Predictive',
                children: [
                  {
                    label: 'Prediction',
                    children: [
                      { label: 'Classification' },
                      { label: 'Regression', children: [{ label: 'Time series analysis' }] },
                    ],
                  },
                ],
              },
              {
                label: 'Descriptive',
                children: [
                  {
                    label: 'Association Rules',
                    children: [{ label: 'Affinity analysis' }, { label: 'Sequence analysis' }, { label: 'Link analysis' }],
                  },
                  { label: 'Clustering', children: [{ label: 'Segmentation' }, { label: 'Outlier analysis' }] },
                  { label: 'Sequence Discovery' },
                  { label: 'Summarization' },
                ],
              },
            ],
          },
        },
        {
          type: 'callout',
          tone: 'caution',
          title: 'Inconsistency in the notes',
          text: 'The bullet list and the taxonomy tree place **Outlier Analysis** under **Descriptive**, but one small "Data Mining Functions" diagram on the same page labels it **[Predictive]**. Follow the list (Descriptive) unless your instructor says otherwise, and confirm before the exam.',
        },
      ],
    },
    {
      id: 'classification',
      title: 'Classification',
      source: { page: 4, section: 'Classification' },
      blocks: [
        {
          type: 'definitions',
          items: [
            {
              term: 'Classification',
              definition:
                'The process of finding a **model** (or function) that describes and distinguishes data classes or concepts.',
            },
            {
              term: 'Training data',
              definition: 'Data objects for which the **class labels are known**. The model is derived by analyzing them.',
            },
            {
              term: 'Prediction step',
              definition: 'The model is used to **predict** the class label of objects for which the class label is **unknown**.',
            },
          ],
        },
        {
          type: 'process',
          steps: [
            { title: 'Training data + known labels', description: 'For example, pictures of fruit labeled "these are apples".' },
            { title: 'Build the model', description: 'A classification algorithm learns from the labeled data.' },
            { title: 'Predict new data', description: 'The model receives an unlabeled object and outputs a predicted label.' },
          ],
        },
        {
          type: 'example',
          title: 'Direct marketing',
          text: '**Goal:** reduce the cost of mailing/advertising by targeting a set of consumers likely to buy a new product.',
          items: [
            'Use the data for a similar product introduced before. We know which customers decided to buy and which decided otherwise. This **{buy, don\'t buy}** decision forms the **class label**.',
            'Collect various demographic, lifestyle, and company-interaction related information about all such customers (type of business, where they stay, how much they earn, etc.).',
            'Use this information as **input attributes** to train a classifier model.',
          ],
        },
        {
          type: 'table',
          caption: 'Activity: training data for a tenure classifier',
          columns: ['Name', 'Rank', 'Years', 'Tenured'],
          rows: [
            ['Mike', 'Assistant Prof', '3', 'no'],
            ['Mary', 'Assistant Prof', '7', 'yes'],
            ['Bill', 'Professor', '2', 'yes'],
            ['Jim', 'Associate Prof', '7', 'yes'],
            ['Dave', 'Assistant Prof', '6', 'no'],
            ['Anne', 'Associate Prof', '3', 'no'],
          ],
        },
        {
          type: 'callout',
          tone: 'note',
          title: 'Classifier (model) learned from the activity',
          text: "**IF** rank = 'professor' **OR** years > 6 **THEN** tenured = 'yes'. Every training row agrees with this rule. Note that Dave (6 years) is 'no', so the threshold is strictly greater than 6.",
        },
      ],
    },
    {
      id: 'clustering',
      title: 'Clustering',
      source: { page: 5, section: 'Clustering' },
      blocks: [
        {
          type: 'list',
          items: [
            'Clustering analyzes data objects **without labels**. It can be used to generate class labels for a group of objects.',
            'Objects are clustered or grouped based on **similarity**: objects within a cluster have **high similarity** to one another but are rather **dissimilar** to objects in other clusters.',
          ],
        },
        {
          type: 'example',
          title: 'Market segmentation',
          text: '**Goal:** subdivide a market into distinct subsets of customers, where any subset may conceivably be selected as a market target to be reached with a distinct marketing mix.',
          items: [
            'Collect different attributes of customers based on their geographical and lifestyle related information.',
            'Find clusters of similar customers.',
            'Measure the clustering quality by observing buying patterns of customers in the same cluster vs. those from different clusters.',
          ],
        },
      ],
    },
    {
      id: 'data-types',
      title: 'Diversity of data types',
      source: { page: 2, section: '4) Diversity of Data Types' },
      blocks: [
        { type: 'list', items: ['Structured data', 'Unstructured data', 'Semi-structured data'] },
        {
          type: 'paragraph',
          text: 'According to the chapter summary, data mining can be applied to **database data**, **data warehouse data**, **transactional data**, and advanced data types such as **time-series, spatial, text, and multimedia** data.',
        },
        {
          type: 'callout',
          tone: 'supplemental',
          title: 'Supplemental (not in the notes)',
          text: 'Common textbook meanings: **structured** data follows a fixed schema (rows and columns in a relational table); **unstructured** data has no predefined schema (free text, images, audio); **semi-structured** data has some organizing tags but no rigid schema (JSON, XML).',
        },
      ],
    },
    {
      id: 'interdisciplinary-and-society',
      title: 'Interdisciplinary nature and society',
      source: { page: 2, section: '5) Interdisciplinary Nature & Society' },
      blocks: [
        {
          type: 'comparison',
          items: [
            {
              title: 'Confluence of disciplines',
              description: 'Data mining requires **Statistics**, **Machine Learning**, and **Database systems** because of:',
              points: ['Scale (Big Data)', 'High dimensionality', 'Complex data sources'],
            },
            {
              title: 'Society and privacy',
              description: 'Data mining benefits science and security but poses risks:',
              points: ['Unintentional disclosure of confidential information', 'Privacy violations'],
            },
          ],
        },
        {
          type: 'callout',
          tone: 'note',
          text: '**Goal:** privacy-preserving data mining.',
        },
        {
          type: 'definitions',
          items: [
            {
              term: 'Technologies used',
              definition: 'Statistics, machine learning, databases, information retrieval, and other domains.',
            },
            {
              term: 'Applications',
              definition: 'Business intelligence, web search, bioinformatics, and other domains.',
            },
            {
              term: 'Key research challenges',
              definition:
                'Mining methodology, user interaction, efficiency and scalability, handling diverse data types, and societal impact.',
            },
          ],
        },
      ],
    },
    {
      id: 'chapter-summary',
      title: 'Chapter summary',
      source: { page: 2, section: 'Summary' },
      blocks: [
        {
          type: 'list',
          items: [
            'Data mining is the **process** of discovering interesting patterns from massive amounts of data, involving data cleaning, integration, selection, transformation, pattern discovery, evaluation, and knowledge presentation.',
            'It can be applied to **various data types**: database, data warehouse, transactional, time-series, spatial, text, and multimedia data.',
            'Its **functionalities** include characterization, discrimination, association and correlation analysis, classification, regression, clustering, and outlier analysis.',
            'It integrates **techniques** from statistics, machine learning, databases, information retrieval, and other domains.',
            'It has successful **applications** in business intelligence, web search, bioinformatics, and other domains.',
            'Key research **challenges**: mining methodology, user interaction, efficiency and scalability, diverse data types, and societal impact.',
          ],
        },
      ],
    },
    {
      id: 'commonly-confused',
      title: 'Commonly confused concepts',
      blocks: [
        {
          type: 'table',
          columns: ['Concept', 'Classification', 'Clustering'],
          rows: [
            ['Labels', 'Training data has known class labels', 'Data objects have no labels'],
            ['Category', 'Predictive', 'Descriptive'],
            ['Result', 'A model that predicts the label of new objects', 'Groups of similar objects (can become labels)'],
            ['Notes example', 'Direct marketing: buy / don\'t buy', 'Market segmentation'],
          ],
        },
        {
          type: 'definitions',
          items: [
            {
              term: 'Descriptive vs. predictive',
              definition:
                'Descriptive tasks **characterize** the data you already have. Predictive tasks perform **induction** on current data to predict values of **new** data.',
            },
            {
              term: 'Data mining vs. KDD',
              definition:
                'KDD is listed as an alternative name, yet in the KDD process diagram data mining is one step of the wider process (after data preparation, before evaluation and presentation).',
            },
            {
              term: 'Class label vs. input attribute',
              definition:
                'In direct marketing the class label is the {buy, don\'t buy} decision; demographic and lifestyle details are input attributes.',
            },
          ],
        },
      ],
    },
  ],

  keyTakeaways: [
    'Data mining extracts interesting (non-trivial, implicit, previously unknown, potentially useful) patterns from huge amounts of data.',
    'KDD is interactive and iterative: data preparation, data mining, pattern/model evaluation, knowledge presentation.',
    'Descriptive tasks characterize existing data; predictive tasks use current data to predict new values.',
    'Classification and prediction are predictive; association rules, clustering, and outlier analysis are listed as descriptive.',
    'Classification learns from labeled training data; clustering groups unlabeled data by similarity.',
    'Data mining draws on statistics, machine learning, and database systems, and aims to be privacy-preserving.',
  ],

  questions: [
    {
      id: 'ch01-q01',
      difficulty: 'easy',
      question: 'Which statement best matches the definition of data mining given in the notes?',
      options: [
        { id: 'a', text: 'Storing large volumes of historical data in a data warehouse for fast retrieval' },
        {
          id: 'b',
          text: 'Extracting interesting (non-trivial, implicit, previously unknown, potentially useful) patterns or knowledge from huge amounts of data',
        },
        { id: 'c', text: 'Running predefined queries to retrieve records that match conditions the user already knows' },
        { id: 'd', text: 'Collecting raw data from many sources and merging it into a single database' },
      ],
      correctOptionId: 'b',
      explanation:
        'Data mining is about discovering knowledge that was not obvious or known beforehand. Storing, querying, or merging data are supporting activities, not the discovery of new patterns.',
      sourceReference: { page: 1, section: '1) What is Data Mining?' },
    },
    {
      id: 'ch01-q02',
      difficulty: 'easy',
      question: 'Which of the following is listed in the notes as an alternative name for data mining?',
      options: [
        { id: 'a', text: 'Online transaction processing (OLTP)' },
        { id: 'b', text: 'Database normalization' },
        { id: 'c', text: 'Data warehousing' },
        { id: 'd', text: 'Knowledge discovery from data (KDD)' },
      ],
      correctOptionId: 'd',
      explanation:
        'The alternative names are knowledge discovery (mining) from data (KDD), knowledge extraction, data/pattern analysis, and business intelligence. A data warehouse is a data source in the KDD process, not another name for mining.',
      sourceReference: { page: 1, section: '1) What is Data Mining?' },
    },
    {
      id: 'ch01-q03',
      difficulty: 'easy',
      question: 'How do the notes describe the overall KDD process?',
      options: [
        { id: 'a', text: 'Interactive and iterative' },
        { id: 'b', text: 'Fully automatic and completed in a single pass' },
        { id: 'c', text: 'Linear, with each step performed exactly once' },
        { id: 'd', text: 'Iterative, but without any user involvement' },
      ],
      correctOptionId: 'a',
      explanation:
        'The KDD process is interactive (the user takes part) and iterative (steps can be repeated, shown by the feedback arrows in the diagram).',
      sourceReference: { page: 1, section: '2) Process of Data Mining (The KDD Process)' },
    },
    {
      id: 'ch01-q04',
      difficulty: 'medium',
      question: 'Which group of steps makes up the data preparation stage of the KDD process?',
      options: [
        { id: 'a', text: 'Pattern evaluation and knowledge presentation' },
        { id: 'b', text: 'Classification, clustering, and regression' },
        { id: 'c', text: 'Data cleaning, data integration, data transformation, and data selection' },
        { id: 'd', text: 'Data mining and pattern/model evaluation' },
      ],
      correctOptionId: 'c',
      explanation:
        'Data preparation covers cleaning, integration, transformation, and selection. Evaluation and presentation come after mining, and classification, clustering, and regression are mining functions.',
      sourceReference: { page: 1, section: '2) Process of Data Mining (The KDD Process)' },
    },
    {
      id: 'ch01-q05',
      difficulty: 'medium',
      question: 'Which sequence shows the correct order of the main KDD stages?',
      options: [
        { id: 'a', text: 'Data mining → Data preparation → Knowledge presentation → Pattern/model evaluation' },
        { id: 'b', text: 'Data preparation → Pattern/model evaluation → Data mining → Knowledge presentation' },
        { id: 'c', text: 'Knowledge presentation → Data preparation → Data mining → Pattern/model evaluation' },
        { id: 'd', text: 'Data preparation → Data mining → Pattern/model evaluation → Knowledge presentation' },
      ],
      correctOptionId: 'd',
      explanation:
        'Data must be prepared before it can be mined. Mined patterns are then evaluated for interestingness, and the useful knowledge is finally presented to the user.',
      sourceReference: { page: 1, section: '2) Process of Data Mining (The KDD Process)' },
    },
    {
      id: 'ch01-q06',
      difficulty: 'medium',
      question: 'What do descriptive mining tasks do?',
      options: [
        { id: 'a', text: 'Perform induction on current data to predict values of new data' },
        { id: 'b', text: 'Assign new, unlabeled objects to predefined classes' },
        { id: 'c', text: 'Characterize the general properties of the data in a target data set' },
        { id: 'd', text: 'Estimate a future numeric value using a trained model' },
      ],
      correctOptionId: 'c',
      explanation:
        'Descriptive tasks characterize the data that already exists. Predicting values or labels for new data is the job of predictive tasks.',
      sourceReference: { page: 1, section: '3) Data Mining Tasks' },
    },
    {
      id: 'ch01-q07',
      difficulty: 'medium',
      question: 'According to the notes, predictive mining tasks…',
      options: [
        { id: 'a', text: 'perform induction on the current data in order to predict values of new data' },
        { id: 'b', text: 'group similar objects that have no class labels' },
        { id: 'c', text: 'summarize the general properties of a target data set' },
        { id: 'd', text: 'discover items that frequently occur together' },
      ],
      correctOptionId: 'a',
      explanation:
        'The key words are induction, current data, and new data: a predictive task learns from data we have to predict values we do not have yet. The other options describe descriptive tasks.',
      sourceReference: { page: 1, section: '3) Data Mining Tasks' },
    },
    {
      id: 'ch01-q08',
      difficulty: 'easy',
      question: 'Which of these data mining functions is classified as predictive?',
      options: [
        { id: 'a', text: 'Clustering' },
        { id: 'b', text: 'Classification' },
        { id: 'c', text: 'Association rules' },
        { id: 'd', text: 'Summarization' },
      ],
      correctOptionId: 'b',
      explanation:
        'Classification builds a model that predicts the class label of new objects, so it is predictive. Clustering, association rules, and summarization are descriptive.',
      sourceReference: { page: 3, section: 'Most famous data mining Functions' },
    },
    {
      id: 'ch01-q09',
      difficulty: 'hard',
      question: 'Which group contains only descriptive tasks, according to the notes?',
      options: [
        { id: 'a', text: 'Classification, regression, time series analysis' },
        { id: 'b', text: 'Clustering, classification, summarization' },
        { id: 'c', text: 'Prediction, association rules, sequence discovery' },
        { id: 'd', text: 'Association rules, sequence discovery, clustering, summarization' },
      ],
      correctOptionId: 'd',
      explanation:
        'The descriptive branch lists association rules, sequence discovery, clustering, and summarization. Classification, regression, time series analysis, and prediction are on the predictive branch.',
      sourceReference: { page: 1, section: '3) Data Mining Tasks' },
    },
    {
      id: 'ch01-q10',
      difficulty: 'easy',
      question: 'In classification, the model is derived from the analysis of…',
      options: [
        { id: 'a', text: 'training data: data objects for which the class labels are known' },
        { id: 'b', text: 'data objects for which the class labels are unknown' },
        { id: 'c', text: 'clusters formed by grouping similar objects' },
        { id: 'd', text: 'randomly assigned labels that are refined later' },
      ],
      correctOptionId: 'a',
      explanation:
        'Classification learns from training data whose class labels are already known. Objects with unknown labels are what the finished model is used on.',
      sourceReference: { page: 4, section: 'Classification' },
    },
    {
      id: 'ch01-q11',
      difficulty: 'medium',
      question: 'Once a classification model has been built, what is it used for?',
      options: [
        { id: 'a', text: 'To clean and integrate the original training data' },
        { id: 'b', text: 'To group the training objects into clusters of similar items' },
        { id: 'c', text: 'To predict the class label of objects whose class label is unknown' },
        { id: 'd', text: 'To discover which items frequently occur together in transactions' },
      ],
      correctOptionId: 'c',
      explanation:
        'The model is applied to new data. In the notes\' fruit example, the model receives a new fruit and predicts "it\'s an apple".',
      sourceReference: { page: 4, section: 'Classification' },
    },
    {
      id: 'ch01-q12',
      difficulty: 'medium',
      question: 'In the direct marketing example, what forms the class label?',
      options: [
        { id: 'a', text: 'How much each customer earns' },
        { id: 'b', text: "The customer's {buy, don't buy} decision for a similar product" },
        { id: 'c', text: 'The type of business each customer works in' },
        { id: 'd', text: 'Where each customer lives' },
      ],
      correctOptionId: 'b',
      explanation:
        'The class label is the outcome we want to predict: whether the customer bought. Income, business type, and location are input attributes used to train the classifier.',
      sourceReference: { page: 4, section: 'Classification' },
    },
    {
      id: 'ch01-q13',
      difficulty: 'hard',
      question:
        "The tenure classifier from the activity is: IF rank = 'professor' OR years > 6 THEN tenured = 'yes'. What does it predict for an Associate Prof with 8 years?",
      options: [
        { id: 'a', text: "'no', because the rank is not 'professor'" },
        { id: 'b', text: "'no', because both conditions must be true" },
        { id: 'c', text: 'It cannot be predicted without more training data' },
        { id: 'd', text: "'yes', because years > 6 satisfies the OR condition" },
      ],
      correctOptionId: 'd',
      explanation:
        'The rule uses OR, so only one condition needs to hold. 8 years is greater than 6, so the prediction is tenured = yes, as with Jim (Associate Prof, 7 years, yes) in the training data.',
      sourceReference: { page: 4, section: 'Activity - Classification Example' },
    },
    {
      id: 'ch01-q14',
      difficulty: 'hard',
      question:
        "In the tenure training data, which record shows that the rule must use 'years > 6' rather than 'years ≥ 6'?",
      options: [
        { id: 'a', text: 'Mary: Assistant Prof, 7 years, tenured = yes' },
        { id: 'b', text: 'Dave: Assistant Prof, 6 years, tenured = no' },
        { id: 'c', text: 'Bill: Professor, 2 years, tenured = yes' },
        { id: 'd', text: 'Anne: Associate Prof, 3 years, tenured = no' },
      ],
      correctOptionId: 'b',
      explanation:
        "Dave has exactly 6 years and is not tenured. With 'years ≥ 6' the rule would wrongly predict yes for him. Mary, Bill, and Anne are consistent with either version.",
      sourceReference: { page: 4, section: 'Activity - Classification Example' },
    },
    {
      id: 'ch01-q15',
      difficulty: 'easy',
      question: 'What kind of data objects does clustering analyze?',
      options: [
        { id: 'a', text: 'Objects whose class labels are all known in advance' },
        { id: 'b', text: 'Only numeric time-series observations' },
        { id: 'c', text: 'Data objects without labels' },
        { id: 'd', text: 'Objects that have already been classified by a model' },
      ],
      correctOptionId: 'c',
      explanation:
        'Clustering works on unlabeled data and can even be used to generate class labels for groups of objects. Needing known labels is what defines classification.',
      sourceReference: { page: 5, section: 'Clustering' },
    },
    {
      id: 'ch01-q16',
      difficulty: 'medium',
      question: 'Which description matches a good clustering result?',
      options: [
        { id: 'a', text: 'High similarity within each cluster and dissimilarity to objects in other clusters' },
        { id: 'b', text: 'Low similarity within each cluster and high similarity between clusters' },
        { id: 'c', text: 'Every cluster contains the same number of objects' },
        { id: 'd', text: 'Each cluster matches a class label provided in the training data' },
      ],
      correctOptionId: 'a',
      explanation:
        'Objects are grouped by similarity: members of the same cluster should be alike, and different clusters should be clearly different. Clustering does not require equal sizes or given labels.',
      sourceReference: { page: 5, section: 'Clustering' },
    },
    {
      id: 'ch01-q17',
      difficulty: 'medium',
      question:
        'A retailer wants to split its customers into distinct groups using geographical and lifestyle information, with no predefined categories, so each group can get its own marketing mix. Which function fits best?',
      options: [
        { id: 'a', text: 'Classification' },
        { id: 'b', text: 'Regression' },
        { id: 'c', text: 'Association rules' },
        { id: 'd', text: 'Clustering' },
      ],
      correctOptionId: 'd',
      explanation:
        'This is the market segmentation example. There are no predefined labels, and the goal is to find groups of similar customers, which is clustering.',
      sourceReference: { page: 5, section: 'Clustering' },
    },
    {
      id: 'ch01-q18',
      difficulty: 'medium',
      question: 'In the market segmentation example, how is the clustering quality measured?',
      options: [
        { id: 'a', text: 'By counting how many customers bought the new product' },
        { id: 'b', text: 'By observing buying patterns of customers in the same cluster vs. those from different clusters' },
        { id: 'c', text: 'By comparing each cluster against known class labels' },
        { id: 'd', text: 'By checking that all clusters contain the same number of customers' },
      ],
      correctOptionId: 'b',
      explanation:
        'Good segments should show similar buying behavior inside a cluster and different behavior across clusters, so the notes compare buying patterns within and between clusters.',
      sourceReference: { page: 5, section: 'Clustering' },
    },
    {
      id: 'ch01-q19',
      difficulty: 'medium',
      question: 'Why does data mining require the confluence of statistics, machine learning, and database systems?',
      options: [
        { id: 'a', text: 'Because data mining only works on relational database tables' },
        { id: 'b', text: 'Because the data is always small and well-structured' },
        { id: 'c', text: 'Because of scale (Big Data), high dimensionality, and complex data sources' },
        { id: 'd', text: 'Because data mining replaces the need for data cleaning' },
      ],
      correctOptionId: 'c',
      explanation:
        'The notes give three reasons: the scale of Big Data, high dimensionality, and complex data sources. No single discipline handles all of these on its own.',
      sourceReference: { page: 2, section: '5) Interdisciplinary Nature & Society' },
    },
    {
      id: 'ch01-q20',
      difficulty: 'medium',
      question: 'Given the societal risks of data mining described in the notes, what is the stated goal?',
      options: [
        { id: 'a', text: 'Privacy-preserving data mining' },
        { id: 'b', text: 'Avoiding data mining in science and security' },
        { id: 'c', text: 'Mining only structured data' },
        { id: 'd', text: 'Publishing all mined patterns openly' },
      ],
      correctOptionId: 'a',
      explanation:
        'Data mining benefits science and security but risks unintentional disclosure of confidential information and privacy violations. The goal is to keep its benefits while protecting privacy.',
      sourceReference: { page: 2, section: '5) Interdisciplinary Nature & Society' },
    },
  ],
};
