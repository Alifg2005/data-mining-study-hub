import type { Chapter } from '../../types/content';

/**
 * Chapter 3: Data Preprocessing (course Lecture 3)
 * Source: the course slide deck "Ch 1.2 &3" (28 slides). Chapter 3 is slides 15-26.
 *   15     Chapter 3 outline and pipeline
 *   16-17  Major Tasks in Data Preprocessing (17 duplicates 16)
 *   18     How to Handle Missing Data?
 *   19-20  Noisy Data / How to Handle Noisy Data?
 *   21     3. Data Integration
 *   22     4. Data Reduction (table; middle column in Arabic, translated here)
 *   23     5. Data Transformation (+ gender binary-encoding image)
 *   24     Summary (table; goal column in Arabic, translated here)
 *
 * Numbering note: the instructor's textbook-style outline places preprocessing inside its
 * "Chapter 2". This site numbers chapters by lecture order, and the slides title it "Chapter 3".
 *
 * Unresolved source conflicts (see the private source analysis report) are shown as caution
 * callouts and are NOT quizzed: the meaning of "normalization", whether discretization belongs
 * to reduction or transformation, and the order of reduction and transformation.
 */
export const chapter03: Chapter = {
  id: 'chapter-03',
  number: 3,
  title: 'Data Preprocessing',
  description:
    'Preparing raw data for mining: cleaning missing and noisy data, integrating sources, reducing data size, and transforming data into a suitable form.',
  sources: [{ id: 'slides', title: 'Lecture slides', unit: 'slide' }],

  learningObjectives: [
    'List the major tasks of data preprocessing and what each one does.',
    'Choose a suitable strategy for handling missing values.',
    'Define noise, recognize its causes, and describe binning, regression, clustering and human inspection.',
    'Explain data integration, the role of ETL, and the main integration issues.',
    'Distinguish feature selection, sampling and discretization by what they reduce or change.',
    'Name the common data transformation methods and read a binary-encoding example.',
  ],

  reviewSections: [
    {
      id: 'overview',
      title: 'Overview and major tasks',
      source: { slide: 16, section: 'Major Tasks in Data Preprocessing' },
      blocks: [
        {
          type: 'paragraph',
          text: 'Raw data is prepared before mining. The chapter outline covers data quality, the major preprocessing tasks, data cleaning, data integration, data reduction, and data transformation and discretization.',
        },
        {
          type: 'definitions',
          items: [
            {
              term: 'Data cleaning',
              definition:
                'Fill in **missing values**, smooth **noisy data**, identify or remove **outliers**, and resolve **inconsistencies**.',
            },
            { term: 'Data integration', definition: 'Integration of multiple **databases, data cubes, or files**.' },
            {
              term: 'Data reduction',
              definition: 'Listed on slide 16 as dimensionality reduction, numerosity reduction and data compression.',
            },
            {
              term: 'Data transformation and data discretization',
              definition: 'Listed on slide 16 as normalization and concept hierarchy generation.',
            },
          ],
        },
        {
          type: 'process',
          title: 'Pipeline shown on slide 15',
          steps: [
            { title: 'Raw data' },
            { title: 'Data cleaning' },
            { title: 'Data integration' },
            { title: 'Data reduction' },
            { title: 'Data transformation' },
            { title: 'Data mining' },
          ],
        },
        {
          type: 'callout',
          tone: 'caution',
          title: 'Step order differs between slides',
          text: 'Slide 15 places data reduction **before** data transformation, while the summary on slide 24 lists data transformation **before** data reduction. Learn what each step does rather than relying on one fixed order.',
        },
      ],
    },
    {
      id: 'missing-data',
      title: 'Data cleaning: missing data',
      source: { slide: 18, section: 'How to Handle Missing Data?' },
      blocks: [
        {
          type: 'definitions',
          items: [
            {
              term: 'Ignore the tuple',
              definition:
                'Usually done when the **class label is missing** (when doing classification). **Not effective** when the percentage of missing values per attribute varies considerably.',
            },
            { term: 'Fill in manually', definition: 'Tedious, and possibly infeasible.' },
            { term: 'Global constant', definition: 'Fill with a constant such as **"unknown"** (in effect, a new class).' },
            { term: 'Attribute mean', definition: 'Fill with the mean of the attribute.' },
            {
              term: 'Attribute mean for the same class',
              definition: 'Fill with the mean of all samples **belonging to the same class**. The slide calls this **"smarter"**.',
            },
            {
              term: 'Most probable value',
              definition: 'Inference-based, such as a **Bayesian formula** or a **decision tree**.',
            },
          ],
        },
      ],
    },
    {
      id: 'noisy-data',
      title: 'Data cleaning: noisy data',
      source: { slide: 19, section: 'Noisy Data' },
      blocks: [
        {
          type: 'definitions',
          items: [{ term: 'Noise', definition: '**Random error or variance** in a measured variable.' }],
        },
        {
          type: 'comparison',
          items: [
            {
              title: 'Incorrect attribute values may be due to',
              points: [
                'Faulty data collection instruments',
                'Data entry problems',
                'Data transmission problems',
                'Technology limitation',
                'Inconsistency in naming convention',
              ],
            },
            {
              title: 'Other problems that require cleaning',
              points: ['Duplicate records', 'Incomplete data', 'Inconsistent data'],
            },
          ],
        },
        {
          type: 'list',
          title: 'How to handle noisy data (slide 20)',
          items: [
            '**Binning:** first sort the data and partition it into (equal-frequency) bins, then smooth by bin means, bin median, bin boundaries, etc.',
            '**Regression:** smooth by fitting the data into regression functions.',
            '**Clustering:** detect and remove outliers.',
            '**Combined computer and human inspection:** detect suspicious values and have a human check them (e.g., possible outliers).',
          ],
        },
      ],
    },
    {
      id: 'data-integration',
      title: 'Data integration',
      source: { slide: 21, section: '3. Data Integration' },
      blocks: [
        {
          type: 'paragraph',
          text: '**Data integration** combines data from multiple sources into a **unified data store or data warehouse**.',
        },
        {
          type: 'process',
          steps: [
            { title: 'Database 1, Database 2, Database 3' },
            { title: 'ETL' },
            { title: 'Data warehouse' },
          ],
        },
        {
          type: 'list',
          title: 'Important issues in data integration',
          items: ['Schema integration', 'Entity identification', 'Redundancy', 'Data inconsistency', 'Duplicate records'],
        },
        {
          type: 'callout',
          tone: 'note',
          text: 'ETL and data warehouses are covered in more detail in Chapter 4.',
        },
      ],
    },
    {
      id: 'data-reduction',
      title: 'Data reduction',
      source: { slide: 22, section: '4. Data Reduction' },
      blocks: [
        {
          type: 'table',
          caption: 'Slide 22 (middle column translated from Arabic)',
          columns: ['Technique', 'What it reduces or changes', 'Example'],
          rows: [
            ['Feature Selection', 'Number of attributes (columns)', '50 attributes → 15'],
            ['Sampling', 'Number of records (rows)', '1,000,000 records → 50,000'],
            ['Discretization', 'Precision / range of continuous values', 'Age 18, 19, 20… → Age Groups'],
          ],
        },
        {
          type: 'tree',
          root: {
            label: 'Data reduction (slide 22 diagram)',
            children: [
              { label: 'Feature selection', children: [{ label: 'Reduce attributes (columns)' }] },
              { label: 'Sampling', children: [{ label: 'Reduce rows (records)' }] },
              { label: 'Discretization', children: [{ label: 'Transform values: continuous → categories' }] },
            ],
          },
        },
        {
          type: 'callout',
          tone: 'caution',
          title: 'Where discretization belongs',
          text: 'Slides 22 and 24 place discretization under **data reduction**, while slides 15 and 16 group it with **data transformation**. Both placements appear in the course slides.',
        },
      ],
    },
    {
      id: 'data-transformation',
      title: 'Data transformation',
      source: { slide: 23, section: '5. Data Transformation' },
      blocks: [
        {
          type: 'paragraph',
          text: '**Data transformation** converts data into a suitable **format or scale** for data mining.',
        },
        {
          type: 'list',
          title: 'Common data transformation methods',
          ordered: true,
          items: ['Smoothing', 'Aggregation', 'Generalization', 'Normalization'],
        },
        {
          type: 'table',
          caption: 'Slide 23 example: binary encoding of Gender',
          columns: ['ID', 'Gender', 'Transformed'],
          rows: [
            ['1', 'M', '1'],
            ['2', 'F', '0'],
            ['3', 'M', '1'],
            ['4', 'M', '1'],
            ['5', 'Unknown (shown as "Not Specified" in the original table)', 'Missing/Unknown'],
          ],
        },
        {
          type: 'example',
          title: 'Grouping and concept hierarchies (slide 16)',
          items: [
            'Ages **18, 19, 20, 21, 22, 23**: instead of treating every number separately, group them: **18-20 → Young**, **21-23 → Older**.',
            'A concept hierarchy: **City → Country → Continent**.',
          ],
        },
        {
          type: 'callout',
          tone: 'caution',
          title: '"Normalization" has two meanings in the course materials',
          text: 'In these slides, normalization is listed as a **data transformation** method. Other course materials use "normalized" for **splitting database tables** to reduce redundancy (for example, the snowflake schema in Chapter 4). Check which meaning a question intends.',
        },
      ],
    },
    {
      id: 'summary',
      title: 'Chapter summary',
      source: { slide: 24, section: 'Summary' },
      blocks: [
        {
          type: 'table',
          caption: 'Slide 24 (Goal column translated from Arabic)',
          columns: ['Task', 'Goal', 'Common methods'],
          rows: [
            ['Data Cleaning', 'Improve data quality', 'Missing values, noise, inconsistency'],
            ['Data Integration', 'Merge data sources', 'Schema integration, ETL, entity resolution'],
            ['Data Reduction', 'Reduce data size', 'Sampling, feature selection, aggregation'],
            ['Data Transformation', 'Convert data into a suitable format', 'Normalization, aggregation, generalization, smoothing'],
          ],
        },
        {
          type: 'paragraph',
          text: 'The summary slide also lists **goal identification and data understanding** as a starting point, before cleaning (missing values, noisy data, inconsistent data).',
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
              term: 'Feature selection vs. sampling',
              definition: 'Feature selection reduces **columns** (attributes); sampling reduces **rows** (records).',
            },
            {
              term: 'Missing data vs. noise',
              definition:
                'Missing data has **no value**; noise is a **random error or variance** in a value that was measured.',
            },
            {
              term: 'Attribute mean vs. class mean',
              definition:
                'The attribute mean uses all samples; the "smarter" option uses only samples **of the same class** as the record being filled.',
            },
            {
              term: 'Integration issues vs. cleaning problems',
              definition:
                'Schema integration and entity identification arise when **combining sources**; noise and missing values are problems **within** the data. Duplicate records and inconsistency appear in both lists.',
            },
          ],
        },
      ],
    },
  ],

  keyTakeaways: [
    'Data cleaning fills in missing values, smooths noisy data, handles outliers, and resolves inconsistencies.',
    'Ignoring a tuple suits a missing class label; the class-wise attribute mean is the "smarter" automatic fill.',
    'Noise is random error or variance; binning, regression, clustering and human inspection handle it.',
    'Data integration combines sources into a unified store, typically through ETL into a data warehouse.',
    'Feature selection reduces columns, sampling reduces rows, discretization turns continuous values into categories.',
    'Data transformation converts data into a suitable format or scale: smoothing, aggregation, generalization, normalization.',
  ],

  questions: [
    {
      id: 'ch03-q01',
      difficulty: 'easy',
      question: 'Which set of activities do the slides list under data cleaning?',
      options: [
        {
          id: 'a',
          text: 'Fill in missing values, smooth noisy data, identify or remove outliers, and resolve inconsistencies',
        },
        { id: 'b', text: 'Combine multiple databases, data cubes, or files into one store' },
        { id: 'c', text: 'Reduce the number of attributes and the number of records' },
        { id: 'd', text: 'Convert data into a suitable format or scale for mining' },
      ],
      correctOptionId: 'a',
      explanation:
        'Slide 16 defines data cleaning by these four activities. Combining sources is data integration, reducing attributes or records is data reduction, and converting format or scale is data transformation.',
      sourceReference: { slide: 16, section: 'Major Tasks in Data Preprocessing' },
    },
    {
      id: 'ch03-q02',
      difficulty: 'easy',
      question: 'How do the slides define data integration?',
      options: [
        { id: 'a', text: 'Replacing missing values with the attribute mean' },
        { id: 'b', text: 'Selecting a subset of records to reduce data size' },
        { id: 'c', text: 'Combining data from multiple sources into a unified data store or data warehouse' },
        { id: 'd', text: 'Grouping continuous values into categories' },
      ],
      correctOptionId: 'c',
      explanation:
        'Slide 21: data integration combines data from multiple sources into a unified data store or data warehouse. The other options describe cleaning, sampling and discretization.',
      sourceReference: { slide: 21, section: '3. Data Integration' },
    },
    {
      id: 'ch03-q03',
      difficulty: 'medium',
      question: 'According to the slides, when is ignoring the tuple usually done?',
      options: [
        { id: 'a', text: 'When the dataset is too large to store' },
        { id: 'b', text: 'When the class label is missing (when doing classification)' },
        { id: 'c', text: 'When an attribute contains outliers' },
        { id: 'd', text: 'When two databases use different schemas' },
      ],
      correctOptionId: 'b',
      explanation:
        'Slide 18: ignoring the tuple is usually done when the class label is missing in a classification task, because a record without its label cannot be used for training.',
      sourceReference: { slide: 18, section: 'How to Handle Missing Data?' },
    },
    {
      id: 'ch03-q04',
      difficulty: 'hard',
      question: 'Why can ignoring tuples with missing values be ineffective, according to the slides?',
      options: [
        { id: 'a', text: 'Because it always introduces noise into the data' },
        { id: 'b', text: 'Because it requires a Bayesian formula to decide which tuples to remove' },
        { id: 'c', text: 'Because it changes the attribute mean of every class' },
        { id: 'd', text: 'Because it is not effective when the percentage of missing values per attribute varies considerably' },
      ],
      correctOptionId: 'd',
      explanation:
        'Slide 18 warns that ignoring the tuple is not effective when the percentage of missing values per attribute varies considerably: many records could be discarded because of a few sparse attributes.',
      sourceReference: { slide: 18, section: 'How to Handle Missing Data?' },
    },
    {
      id: 'ch03-q05',
      difficulty: 'medium',
      question:
        'A hospital dataset is used to classify patients as "diabetic: yes/no", and some blood-pressure values are missing. Which automatic fill do the slides describe as "smarter"?',
      options: [
        { id: 'a', text: 'Fill with the global constant "unknown"' },
        { id: 'b', text: 'Fill with the mean blood pressure of patients in the same class' },
        { id: 'c', text: 'Fill with the mean blood pressure of all patients' },
        { id: 'd', text: 'Remove the blood-pressure attribute entirely' },
      ],
      correctOptionId: 'b',
      explanation:
        'Slide 18 calls the attribute mean for all samples belonging to the same class "smarter": a diabetic patient\'s missing value is filled using other diabetic patients, not the whole population.',
      sourceReference: { slide: 18, section: 'How to Handle Missing Data?' },
    },
    {
      id: 'ch03-q06',
      difficulty: 'medium',
      question: 'Filling a missing value with "the most probable value" is described on the slides as…',
      options: [
        { id: 'a', text: 'tedious and possibly infeasible' },
        { id: 'b', text: 'using a global constant such as "unknown"' },
        { id: 'c', text: 'removing the record from the dataset' },
        { id: 'd', text: 'inference-based, such as a Bayesian formula or a decision tree' },
      ],
      correctOptionId: 'd',
      explanation:
        'Slide 18: the most probable value is found by inference, for example with a Bayesian formula or a decision tree. "Tedious + infeasible?" describes manual filling.',
      sourceReference: { slide: 18, section: 'How to Handle Missing Data?' },
    },
    {
      id: 'ch03-q07',
      difficulty: 'easy',
      question: 'Which example of a global constant for missing values appears on the slides?',
      options: [
        { id: 'a', text: '"unknown"' },
        { id: 'b', text: 'The attribute mean' },
        { id: 'c', text: 'The bin median' },
        { id: 'd', text: 'The value predicted by a decision tree' },
      ],
      correctOptionId: 'a',
      explanation:
        'Slide 18 gives "unknown" as a global constant, noting that it effectively creates a new class. The attribute mean and predicted values are different fill strategies; the bin median is a noise-smoothing method.',
      sourceReference: { slide: 18, section: 'How to Handle Missing Data?' },
    },
    {
      id: 'ch03-q08',
      difficulty: 'easy',
      question: 'How do the slides define noise?',
      options: [
        { id: 'a', text: 'A value that is missing from a record' },
        { id: 'b', text: 'A record that appears twice in the dataset' },
        { id: 'c', text: 'Random error or variance in a measured variable' },
        { id: 'd', text: 'An attribute with too many distinct values' },
      ],
      correctOptionId: 'c',
      explanation:
        'Slide 19 defines noise as random error or variance in a measured variable. Missing values and duplicate records are separate data problems.',
      sourceReference: { slide: 19, section: 'Noisy Data' },
    },
    {
      id: 'ch03-q09',
      difficulty: 'medium',
      question: 'Which of the following is listed on the slides as a possible cause of incorrect attribute values?',
      options: [
        { id: 'a', text: 'Selecting too few attributes' },
        { id: 'b', text: 'Sampling too many records' },
        { id: 'c', text: 'Grouping ages into categories' },
        { id: 'd', text: 'Faulty data collection instruments' },
      ],
      correctOptionId: 'd',
      explanation:
        'Slide 19 lists faulty data collection instruments, data entry problems, data transmission problems, technology limitation, and inconsistent naming conventions. The other options are preprocessing choices, not causes of noise.',
      sourceReference: { slide: 19, section: 'Noisy Data' },
    },
    {
      id: 'ch03-q10',
      difficulty: 'medium',
      question: 'On slide 16, what does the example "City → Country → Continent" illustrate?',
      options: [
        { id: 'a', text: 'Entity identification during data integration' },
        { id: 'b', text: 'A concept hierarchy' },
        { id: 'c', text: 'Smoothing by bin boundaries' },
        { id: 'd', text: 'Sampling of records' },
      ],
      correctOptionId: 'b',
      explanation:
        'Slide 16 lists concept hierarchy generation, and its image shows City → Country → Continent: each level is a more general concept than the one before.',
      sourceReference: { slide: 16, section: 'Major Tasks in Data Preprocessing' },
    },
    {
      id: 'ch03-q11',
      difficulty: 'medium',
      question: 'After sorting the data and partitioning it into bins, how can binning smooth noisy data?',
      options: [
        { id: 'a', text: 'By bin means, bin median, or bin boundaries' },
        { id: 'b', text: 'By fitting a regression function to each bin' },
        { id: 'c', text: 'By deleting every bin that contains an outlier' },
        { id: 'd', text: 'By merging bins from different databases' },
      ],
      correctOptionId: 'a',
      explanation:
        'Slide 20: binning first sorts data and partitions it into bins, then smooths by bin means, bin median, or bin boundaries. Regression is a separate smoothing method.',
      sourceReference: { slide: 20, section: 'How to Handle Noisy Data?' },
    },
    {
      id: 'ch03-q12',
      difficulty: 'medium',
      question: 'What role do the slides give to clustering when handling noisy data?',
      options: [
        { id: 'a', text: 'Filling in missing class labels' },
        { id: 'b', text: 'Combining schemas from different sources' },
        { id: 'c', text: 'Detecting and removing outliers' },
        { id: 'd', text: 'Converting categories into binary values' },
      ],
      correctOptionId: 'c',
      explanation:
        'Slide 20 lists clustering as a way to detect and remove outliers: values that do not fall into any cluster stand out.',
      sourceReference: { slide: 20, section: 'How to Handle Noisy Data?' },
    },
    {
      id: 'ch03-q13',
      difficulty: 'medium',
      question: 'How does regression help with noisy data, according to the slides?',
      options: [
        { id: 'a', text: 'It sorts the data into equal-frequency bins' },
        { id: 'b', text: 'It smooths the data by fitting it into regression functions' },
        { id: 'c', text: 'It asks a human to check suspicious values' },
        { id: 'd', text: 'It removes duplicate records' },
      ],
      correctOptionId: 'b',
      explanation:
        'Slide 20: regression smooths data by fitting it into regression functions. Sorting into bins is binning, and human checking is "combined computer and human inspection".',
      sourceReference: { slide: 20, section: 'How to Handle Noisy Data?' },
    },
    {
      id: 'ch03-q14',
      difficulty: 'hard',
      question:
        'Two customer databases store the same customer as "Cust_ID 1042" and "ClientNo A-1042". Recognizing that both refer to one real-world customer is which data integration issue?',
      options: [
        { id: 'a', text: 'Noise' },
        { id: 'b', text: 'Sampling' },
        { id: 'c', text: 'Data compression' },
        { id: 'd', text: 'Entity identification' },
      ],
      correctOptionId: 'd',
      explanation:
        'Slide 21 lists entity identification among the important integration issues: deciding whether records from different sources describe the same entity. Noise, sampling and compression belong to cleaning and reduction.',
      sourceReference: { slide: 21, section: '3. Data Integration' },
    },
    {
      id: 'ch03-q15',
      difficulty: 'easy',
      question: 'In the slide 21 diagram, what step sits between the source databases and the data warehouse?',
      options: [
        { id: 'a', text: 'Sampling' },
        { id: 'b', text: 'Binning' },
        { id: 'c', text: 'ETL' },
        { id: 'd', text: 'Feature selection' },
      ],
      correctOptionId: 'c',
      explanation: 'The diagram shows Database 1, 2 and 3 feeding into ETL, which then loads the data warehouse.',
      sourceReference: { slide: 21, section: '3. Data Integration' },
    },
    {
      id: 'ch03-q16',
      difficulty: 'easy',
      question: 'A dataset is reduced from 50 attributes to the 15 most relevant ones. Which reduction technique is this?',
      options: [
        { id: 'a', text: 'Feature selection' },
        { id: 'b', text: 'Sampling' },
        { id: 'c', text: 'Data integration' },
        { id: 'd', text: 'Smoothing' },
      ],
      correctOptionId: 'a',
      explanation:
        'Slide 22: feature selection reduces the number of attributes (columns), with the example 50 attributes → 15. Sampling would reduce rows instead.',
      sourceReference: { slide: 22, section: '4. Data Reduction' },
    },
    {
      id: 'ch03-q17',
      difficulty: 'medium',
      question: 'What does sampling reduce, according to the data reduction table on slide 22?',
      options: [
        { id: 'a', text: 'The number of attributes (columns)' },
        { id: 'b', text: 'The precision of continuous values' },
        { id: 'c', text: 'The number of data sources' },
        { id: 'd', text: 'The number of records (rows), e.g., 1,000,000 → 50,000' },
      ],
      correctOptionId: 'd',
      explanation:
        'Slide 22: sampling reduces the number of records (rows), shown as 1,000,000 records → 50,000. Feature selection reduces columns, and discretization changes value precision.',
      sourceReference: { slide: 22, section: '4. Data Reduction' },
    },
    {
      id: 'ch03-q18',
      difficulty: 'medium',
      question: 'What does discretization do to an attribute such as Age (18, 19, 20, …)?',
      options: [
        { id: 'a', text: 'Removes the attribute from the dataset' },
        { id: 'b', text: 'Transforms the continuous values into categories (age groups)' },
        { id: 'c', text: 'Fills in missing ages with the mean age' },
        { id: 'd', text: 'Encodes each age as 1 or 0' },
      ],
      correctOptionId: 'b',
      explanation:
        'Slide 22 describes discretization as transforming values from continuous to categories, e.g., Age 18, 19, 20… → age groups. It changes the precision of the values rather than removing them.',
      sourceReference: { slide: 22, section: '4. Data Reduction' },
    },
    {
      id: 'ch03-q19',
      difficulty: 'hard',
      question: 'Which of these is NOT one of the four common data transformation methods listed on slide 23?',
      options: [
        { id: 'a', text: 'Smoothing' },
        { id: 'b', text: 'Generalization' },
        { id: 'c', text: 'Sampling' },
        { id: 'd', text: 'Aggregation' },
      ],
      correctOptionId: 'c',
      explanation:
        'Slide 23 lists smoothing, aggregation, generalization and normalization. Sampling is a data reduction technique (slide 22).',
      sourceReference: { slide: 23, section: '5. Data Transformation' },
    },
    {
      id: 'ch03-q20',
      difficulty: 'hard',
      question:
        'In the slide 23 binary-encoding example, M becomes 1 and F becomes 0. What value is given to record 5, whose gender is not specified?',
      options: [
        { id: 'a', text: 'Missing/Unknown' },
        { id: 'b', text: '0' },
        { id: 'c', text: '1' },
        { id: 'd', text: 'The most frequent gender' },
      ],
      correctOptionId: 'a',
      explanation:
        'The example keeps the unspecified value as "Missing/Unknown" instead of forcing it to 0 or 1, so the encoding does not invent information.',
      sourceReference: { slide: 23, section: '5. Data Transformation' },
    },
  ],
};
