import type { Chapter } from '../../types/content';

/**
 * Chapter 4: Data Warehousing and OLAP (course Lecture 4)
 * Sources:
 *   edw        "EDW1" notes, 5 pages
 *              p.1 multidimensional model, schema designs; p.2 OLAP operations, architecture;
 *              p.3 ROLAP/MOLAP, top tier, design framework; p.4 cube computation, indexing,
 *              query processing; p.5 attribute-oriented induction
 *   dwh-terms  "DWH: What, why, OLAP" Word notes, cited by section heading
 *
 * Numbering note: the instructor's textbook-style outline calls this "Chapter 3: Data
 * Warehousing and Analytical Processing". This site numbers chapters by lecture order.
 *
 * Excluded from the quiz: the attribute-oriented induction GPA rule on p.5 (its "> 3.5"
 * threshold conflicts with the example that includes a GPA of exactly 3.5).
 */
export const chapter04: Chapter = {
  id: 'chapter-04',
  number: 4,
  title: 'Data Warehousing and OLAP',
  description:
    'What a data warehouse is and why it is needed, OLTP vs. OLAP, the multidimensional model and schemas, OLAP operations, architecture, and efficient cube computation.',
  sources: [
    { id: 'edw', title: 'Data warehousing notes', unit: 'page' },
    { id: 'dwh-terms', title: 'DWH: what, why, OLAP', unit: 'section' },
  ],

  learningObjectives: [
    'Define a data warehouse and explain why organizations need one.',
    'Distinguish OLTP from OLAP.',
    'Describe the multidimensional model: data cubes, dimensions, measures, fact and dimension tables.',
    'Compare star, snowflake and fact constellation schemas.',
    'Apply the OLAP operations roll-up, drill-down, slice, dice and pivot.',
    'Describe the three-tier architecture, ETL vs. ELT, staging areas and operational data stores.',
    'Explain materialization strategies, OLAP indexing and attribute-oriented induction.',
  ],

  reviewSections: [
    {
      id: 'what-is-a-data-warehouse',
      title: 'What is a data warehouse?',
      source: { sourceId: 'dwh-terms', section: 'Introduction | Data warehouse Definition' },
      blocks: [
        {
          type: 'definitions',
          items: [
            {
              term: 'Data warehouse (DW)',
              definition:
                'A **central repository of integrated data** from one or more disparate sources, used for **reporting and data analysis**. It is a core component of business intelligence.',
            },
            {
              term: 'Business intelligence (BI)',
              definition:
                'The strategies and technologies enterprises use for the data analysis of business information. Implementing a BI solution needs a data warehouse.',
            },
          ],
        },
        {
          type: 'paragraph',
          text: 'A data warehouse is designed for **analysis**, not just transaction processing (Data warehousing notes, p. 1).',
        },
      ],
    },
    {
      id: 'why-a-data-warehouse',
      title: 'Why we need a data warehouse',
      source: { sourceId: 'dwh-terms', section: 'Why we need Data warehouse' },
      blocks: [
        {
          type: 'list',
          items: [
            'Integrate many different sources of data.',
            'Avoid users running reports directly against operational systems.',
            'Have a **single version of the truth**.',
            'Gather tons of historical data in one easily accessible place, even if the source transaction systems do not keep it.',
            'Reduce the risk that report users misuse or corrupt transaction data.',
            'Let users create their own reports without involving IT (**self-service BI**).',
            'Provide a convenient place to create and store metadata and business logic.',
            'Improve data quality by cleaning data as it is imported into the warehouse.',
          ],
        },
      ],
    },
    {
      id: 'oltp-vs-olap',
      title: 'OLTP vs. OLAP',
      source: { sourceId: 'dwh-terms', section: 'Terminologies | OLTP vs OLAP' },
      blocks: [
        {
          type: 'comparison',
          items: [
            {
              title: 'OLTP',
              tag: 'Online transaction processing',
              description: 'Captures, stores, and processes data from transactions **in real time**.',
              points: ['Example tables: Transactions, Items, Sold'],
            },
            {
              title: 'OLAP',
              tag: 'Online analytical processing',
              description: 'Uses **complex queries** to analyze **aggregated historical data** from OLTP systems.',
              points: ['Example: a cube with Time and Product dimensions and measures'],
            },
          ],
        },
      ],
    },
    {
      id: 'multidimensional-model',
      title: 'The multidimensional model',
      source: { sourceId: 'edw', page: 1, section: '1. Data Warehousing: A Multi-dimensional Model' },
      blocks: [
        {
          type: 'paragraph',
          text: 'The **multidimensional model** views data as a **data cube**.',
        },
        {
          type: 'definitions',
          items: [
            {
              term: 'Dimensions',
              definition: 'The perspectives or entities **by which** you want to analyze data (e.g., Time, Product, Location).',
            },
            {
              term: 'Measures',
              definition: 'The **numerical facts** or metrics you want to analyze (e.g., Sales Amount, Quantity Sold, Profit).',
            },
            {
              term: 'Fact table',
              definition:
                'What you want to analyze: contains **measures** along with **foreign keys** to the dimension tables. Usually transaction tables in the OLTP system.',
            },
            {
              term: 'Dimension table',
              definition:
                'A business entity with its own attributes, related to the fact table. Usually reference / lookup tables in the OLTP system.',
            },
          ],
        },
        {
          type: 'example',
          title: 'A cube for a retail store',
          items: [
            '**Dimensions:** Time (Year, Quarter, Month), Product (Category, Item), Location (City, State).',
            '**Measure:** Total Sales ($).',
          ],
        },
      ],
    },
    {
      id: 'schema-designs',
      title: 'Schema designs',
      source: { sourceId: 'edw', page: 1, section: 'Schema Designs' },
      blocks: [
        {
          type: 'paragraph',
          text: 'Schemas are the ways the warehouse tables are organized to support the multidimensional model.',
        },
        {
          type: 'table',
          columns: ['Schema', 'Structure', 'Example', 'Trade-off'],
          rows: [
            [
              'Star',
              'A central fact table (measures and foreign keys) surrounded by dimension tables',
              'Sales_Fact linked to Time_Dim, Product_Dim, Store_Dim',
              'Simple and fast for queries',
            ],
            [
              'Snowflake',
              'Like a star, but the dimension tables are normalized (split into further tables to reduce redundancy)',
              'A Product table linked to a Category table, which is linked to a Brand table',
              'Saves space, but queries are slower (more joins)',
            ],
            [
              'Fact constellation (galaxy)',
              'Multiple fact tables that share dimension tables',
              'Sales_Fact and Shipping_Fact both share Time_Dim and Product_Dim',
              'Not stated in the notes',
            ],
          ],
        },
        {
          type: 'callout',
          tone: 'note',
          text: 'Here "normalized" refers to splitting tables in database design. Chapter 3 lists normalization as a data transformation method; the two uses are different.',
        },
      ],
    },
    {
      id: 'olap-operations',
      title: 'OLAP operations',
      source: { sourceId: 'edw', page: 2, section: 'OLAP Operations (Online Analytical Processing)' },
      blocks: [
        {
          type: 'paragraph',
          text: 'OLAP operations are the actions users perform on the data cube to analyze it.',
        },
        {
          type: 'table',
          columns: ['Operation', 'What it does', 'Example from the notes'],
          rows: [
            [
              'Roll-up (aggregation)',
              'Summarizes data by climbing up a concept hierarchy or reducing dimensions',
              'Summing monthly sales to get yearly sales (City → Country)',
            ],
            ['Drill-down', 'The opposite of roll-up: from summary data to detailed data', 'Breaking yearly sales down into quarterly sales (Country → City)'],
            ['Slice', 'Selects a single value for one dimension to create a sub-cube', '"Show me sales for Time = 2023" (fixing one axis)'],
            ['Dice', 'Selects specific values for multiple dimensions', '"Time = 2023 AND Product = Laptop AND Location = New York"'],
            ['Pivot (rotate)', 'Rotates the data axes to view the data from a different perspective', 'Rows = Products, Columns = Time becomes Rows = Time, Columns = Products'],
          ],
        },
      ],
    },
    {
      id: 'architecture',
      title: 'Three-tier architecture',
      source: { sourceId: 'edw', page: 2, section: '2. Data Warehouse Architecture, Design, and Usage' },
      blocks: [
        {
          type: 'tree',
          root: {
            label: 'Most modern data warehouses use a 3-tier architecture',
            children: [
              {
                label: 'Top tier: client / front-end',
                children: [{ label: 'Dashboards and reporting tools (e.g., Tableau, Power BI)' }, { label: 'Query/report, analysis, data mining' }],
              },
              {
                label: 'Middle tier: OLAP server',
                children: [
                  { label: 'Processes analytical queries; translates requests into SQL or OLAP commands' },
                  { label: 'ROLAP: relational OLAP, uses standard SQL' },
                  { label: 'MOLAP: multidimensional OLAP, uses specialized array-based storage' },
                ],
              },
              {
                label: 'Bottom tier: data warehouse server',
                children: [
                  { label: 'The warehouse database (usually relational, e.g., Oracle, SQL Server)' },
                  { label: 'Data marts and a metadata repository' },
                  { label: 'Loaded from operational databases and external sources (extract, clean, transform, load, refresh)' },
                ],
              },
            ],
          },
        },
      ],
    },
    {
      id: 'etl-staging-ods',
      title: 'ETL, ELT, staging and ODS',
      source: { sourceId: 'dwh-terms', section: 'Terminologies | ETL vs ELT' },
      blocks: [
        {
          type: 'comparison',
          items: [
            {
              title: 'ETL',
              tag: 'Extract, Transform, Load',
              description: 'Used in **on-premise** BI / data warehouse solutions.',
              points: ['Data is extracted into a staging area, then transformed and loaded into the warehouse'],
            },
            {
              title: 'ELT',
              tag: 'Extract, Load, Transform',
              description: 'Used in **cloud technologies** and **data lakes**.',
              points: ['All data is extracted and loaded first (e.g., Hadoop), then transformed'],
            },
          ],
        },
        {
          type: 'definitions',
          items: [
            {
              term: 'Staging area',
              definition:
                'A **landing zone**: intermediate storage used for data processing during ETL, sitting between the data sources and the targets (warehouses, data marts, other repositories).',
            },
            {
              term: 'Operational data store (ODS)',
              definition:
                'A central database giving a **snapshot of the latest data** from multiple transactional systems for **operational reporting**. It also feeds the enterprise data warehouse and supports tactical decision-making.',
            },
          ],
        },
      ],
    },
    {
      id: 'design-framework',
      title: 'Business analysis design framework',
      source: { sourceId: 'edw', page: 3, section: 'Business Analysis Design Framework' },
      blocks: [
        {
          type: 'process',
          title: 'Lifecycle of building a warehouse to support business decisions',
          steps: [
            { title: 'Requirements analysis', description: 'Which business questions need answering? (e.g., "Which region sells the most?")' },
            { title: 'Conceptual design', description: 'Choose the dimensions and measures (the data cube model).' },
            { title: 'Logical design', description: 'Choose the schema (star vs. snowflake).' },
            { title: 'Physical design', description: 'Decide on hardware, indexing, and partitioning for performance.' },
          ],
        },
      ],
    },
    {
      id: 'cube-computation',
      title: 'Efficient computation of data cubes',
      source: { sourceId: 'edw', page: 4, section: '3. Implementation: Efficient Computation of Data Cubes' },
      blocks: [
        {
          type: 'paragraph',
          text: 'Pre-calculating all possible aggregations of a cube is expensive, so we decide how much to pre-calculate.',
        },
        {
          type: 'table',
          columns: ['Materialization', 'What is computed', 'Pros', 'Cons'],
          rows: [
            ['Full', 'Every possible combination of dimensions (every cuboid)', 'Fastest query response', 'Massive storage space'],
            ['None', 'Nothing in advance; calculated on the fly', 'Saves storage space', 'Very slow query response'],
            ['Partial', 'A selected subset of cuboids (usually the most used)', 'Balance between storage and query speed', 'Not stated in the notes'],
          ],
        },
        {
          type: 'definitions',
          items: [
            {
              term: 'Bitmap index',
              definition:
                'Good for **low-cardinality** columns (few distinct values, like Gender or Status). For a Color column it creates a bit string per color (Red: 10010, Blue: 01001), allowing very fast AND/OR operations.',
            },
            {
              term: 'Join index',
              definition:
                'Preserves the join of a fact table and a dimension table, e.g., storing the mapping of Sales_ID to Product_Category so the tables need not be joined every time.',
            },
          ],
        },
        {
          type: 'process',
          title: 'OLAP query processing',
          steps: [
            { title: 'Parsing', description: 'The system understands the query.' },
            { title: 'Optimization', description: 'Decide the best way: a materialized cube, an index, or a raw-data scan.' },
            { title: 'Execution', description: 'The data is retrieved and aggregated.' },
          ],
        },
      ],
    },
    {
      id: 'attribute-oriented-induction',
      title: 'Data generalization: attribute-oriented induction',
      source: { sourceId: 'edw', page: 5, section: '4. Data Generalization: Attribute-oriented Induction' },
      blocks: [
        {
          type: 'paragraph',
          text: 'Attribute-oriented induction summarizes data by **replacing low-level concepts with high-level concepts**, so patterns can be found without the details of every record.',
        },
        {
          type: 'process',
          steps: [
            { title: 'Data focusing', description: 'Select the relevant data (e.g., only science majors).' },
            {
              title: 'Attribute removal',
              description: 'Remove an attribute with too many distinct values and no generalization operator (like a Student ID).',
            },
            { title: 'Attribute generalization', description: 'Climb the concept hierarchy for each remaining attribute.' },
          ],
        },
        {
          type: 'example',
          title: 'Students example',
          items: [
            'Age 19, 20, 21 → "Young Adult".',
            'Major CS, Math, Physics → "Science Major".',
            'GPA 3.8, 3.5, 3.9 → "High Achiever".',
            'Generalized rule: "Science Majors who are Young Adults are likely High Achievers."',
          ],
        },
        {
          type: 'callout',
          tone: 'caution',
          title: 'Check the GPA threshold',
          text: 'The notes define "High Achiever" as GPA **> 3.5**, but the example also generalizes a GPA of exactly **3.5** to "High Achiever". Confirm the intended boundary with your instructor.',
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
            { term: 'Slice vs. dice', definition: 'Slice fixes **one** dimension to a single value; dice selects values on **several** dimensions.' },
            { term: 'Roll-up vs. drill-down', definition: 'Roll-up goes from detail to **summary**; drill-down goes from summary to **detail**.' },
            {
              term: 'Dimension vs. measure',
              definition: 'A dimension is what you analyze **by** (Time, Product); a measure is the **number** you analyze (Sales Amount).',
            },
            {
              term: 'Star vs. snowflake',
              definition: 'Snowflake splits dimension tables further: less space, but more joins and slower queries.',
            },
            { term: 'ROLAP vs. MOLAP', definition: 'ROLAP uses standard SQL on relational tables; MOLAP uses array-based storage.' },
            {
              term: 'Staging area vs. ODS',
              definition:
                'Staging is a temporary landing zone during ETL; the ODS holds an up-to-date snapshot for operational reporting.',
            },
          ],
        },
      ],
    },
  ],

  keyTakeaways: [
    'A data warehouse is a central repository of integrated data for reporting and analysis, and a core part of BI.',
    'OLTP processes transactions in real time; OLAP analyzes aggregated historical data with complex queries.',
    'The data cube has dimensions (what you analyze by) and measures (the numbers); fact tables hold measures and foreign keys.',
    'Star is simple and fast; snowflake normalizes dimensions (less space, more joins); a galaxy shares dimensions across fact tables.',
    'Roll-up, drill-down, slice, dice and pivot let users explore the cube.',
    'Partial materialization balances storage against query speed; bitmap indexes suit low-cardinality columns.',
  ],

  questions: [
    {
      id: 'ch04-q01',
      difficulty: 'easy',
      question: 'Which statement best matches the definition of a data warehouse in the course notes?',
      options: [
        { id: 'a', text: 'A system that records each sales transaction in real time' },
        { id: 'b', text: 'A central repository of integrated data from one or more disparate sources' },
        { id: 'c', text: 'A temporary landing zone used only while data is being loaded' },
        { id: 'd', text: 'A single fact table with no dimension tables' },
      ],
      correctOptionId: 'b',
      explanation:
        'Data warehouses are central repositories of integrated data from one or more disparate sources, used for reporting and analysis. Real-time transaction recording is OLTP, and a temporary landing zone is a staging area.',
      sourceReference: { sourceId: 'dwh-terms', section: 'Introduction | Data warehouse Definition' },
    },
    {
      id: 'ch04-q02',
      difficulty: 'easy',
      question: 'Which of these is listed in the notes as a reason for needing a data warehouse?',
      options: [
        { id: 'a', text: 'To run all reports directly against the operational systems' },
        { id: 'b', text: 'To delete historical data that transaction systems no longer need' },
        { id: 'c', text: 'To process each customer payment the moment it happens' },
        { id: 'd', text: 'To have a single version of the truth' },
      ],
      correctOptionId: 'd',
      explanation:
        'The notes list a single version of the truth, along with integrating sources, keeping historical data, and avoiding reports directly against operational systems (the opposite of option A).',
      sourceReference: { sourceId: 'dwh-terms', section: 'Why we need Data warehouse' },
    },
    {
      id: 'ch04-q03',
      difficulty: 'easy',
      question: 'How do the notes describe OLAP?',
      options: [
        { id: 'a', text: 'It uses complex queries to analyze aggregated historical data from OLTP systems' },
        { id: 'b', text: 'It captures and processes transaction data in real time' },
        { id: 'c', text: 'It extracts all data into a data lake before transforming it' },
        { id: 'd', text: 'It stores only the latest snapshot of operational data' },
      ],
      correctOptionId: 'a',
      explanation:
        'OLAP (online analytical processing) analyzes aggregated historical data with complex queries. Real-time transaction processing is OLTP; the latest snapshot describes an ODS.',
      sourceReference: { sourceId: 'dwh-terms', section: 'Terminologies | OLTP vs OLAP' },
    },
    {
      id: 'ch04-q04',
      difficulty: 'medium',
      question: "A supermarket's checkout system records every sale the moment it happens. What kind of system is this?",
      options: [
        { id: 'a', text: 'OLAP' },
        { id: 'b', text: 'A data mart' },
        { id: 'c', text: 'OLTP' },
        { id: 'd', text: 'A MOLAP server' },
      ],
      correctOptionId: 'c',
      explanation:
        'OLTP captures, stores, and processes data from transactions in real time. OLAP, data marts and MOLAP servers are used to analyze data afterwards.',
      sourceReference: { sourceId: 'dwh-terms', section: 'Terminologies | OLTP vs OLAP' },
    },
    {
      id: 'ch04-q05',
      difficulty: 'easy',
      question: "In the notes' retail cube example, which of these is a measure?",
      options: [
        { id: 'a', text: 'Total Sales ($)' },
        { id: 'b', text: 'Time (Year, Quarter, Month)' },
        { id: 'c', text: 'Product (Category, Item)' },
        { id: 'd', text: 'Location (City, State)' },
      ],
      correctOptionId: 'a',
      explanation:
        'Measures are the numerical facts you want to analyze, such as Total Sales. Time, Product and Location are dimensions: the perspectives you analyze the sales by.',
      sourceReference: { sourceId: 'edw', page: 1, section: '1. Data Warehousing: A Multi-dimensional Model' },
    },
    {
      id: 'ch04-q06',
      difficulty: 'medium',
      question: 'What does a fact table contain?',
      options: [
        { id: 'a', text: 'Only descriptive attributes such as product names and colors' },
        { id: 'b', text: 'Copies of every dimension table' },
        { id: 'c', text: 'Measures along with foreign keys referencing the dimension tables' },
        { id: 'd', text: 'Bit strings for each distinct value of a column' },
      ],
      correctOptionId: 'c',
      explanation:
        'A fact table holds the measures you want to analyze plus foreign keys to the dimension tables. Descriptive attributes belong in dimension tables; bit strings describe a bitmap index.',
      sourceReference: { sourceId: 'dwh-terms', section: 'Terminologies | Fact vs Dimension' },
    },
    {
      id: 'ch04-q07',
      difficulty: 'medium',
      question: 'According to the notes, dimension tables usually come from which kind of OLTP tables?',
      options: [
        { id: 'a', text: 'Transaction tables' },
        { id: 'b', text: 'Staging tables' },
        { id: 'c', text: 'Log tables of failed queries' },
        { id: 'd', text: 'Reference / lookup tables' },
      ],
      correctOptionId: 'd',
      explanation:
        'Dimensions are business entities "by which you want to analyze" and usually come from reference/lookup tables. Fact tables usually come from transaction tables.',
      sourceReference: { sourceId: 'dwh-terms', section: 'Terminologies | Fact vs Dimension' },
    },
    {
      id: 'ch04-q08',
      difficulty: 'easy',
      question: 'Which schema has a central fact table surrounded directly by dimension tables, and is described as simple and fast for queries?',
      options: [
        { id: 'a', text: 'Snowflake schema' },
        { id: 'b', text: 'Star schema' },
        { id: 'c', text: 'Fact constellation' },
        { id: 'd', text: 'Operational data store' },
      ],
      correctOptionId: 'b',
      explanation:
        'In a star schema the Sales_Fact table links directly to Time_Dim, Product_Dim and Store_Dim, so it looks like a star and needs few joins.',
      sourceReference: { sourceId: 'edw', page: 1, section: 'Schema Designs' },
    },
    {
      id: 'ch04-q09',
      difficulty: 'medium',
      question: 'What trade-off do the notes give for the snowflake schema compared with the star schema?',
      options: [
        { id: 'a', text: 'Faster queries but much more storage' },
        { id: 'b', text: 'No dimension tables, so no joins are needed' },
        { id: 'c', text: 'Saves space, but queries are slower because of more joins' },
        { id: 'd', text: 'It needs several fact tables for every query' },
      ],
      correctOptionId: 'c',
      explanation:
        'Snowflake schemas normalize dimension tables into further tables. This reduces redundancy and saves space, but queries need more joins and run slower.',
      sourceReference: { sourceId: 'edw', page: 1, section: 'Schema Designs' },
    },
    {
      id: 'ch04-q10',
      difficulty: 'medium',
      question: 'A Sales_Fact table and a Shipping_Fact table both share Time_Dim and Product_Dim. Which schema is this?',
      options: [
        { id: 'a', text: 'Fact constellation (galaxy schema)' },
        { id: 'b', text: 'Star schema' },
        { id: 'c', text: 'Snowflake schema' },
        { id: 'd', text: 'A single data cube with one measure' },
      ],
      correctOptionId: 'a',
      explanation: 'A fact constellation (galaxy schema) has multiple fact tables that share dimension tables, exactly as in this example from the notes.',
      sourceReference: { sourceId: 'edw', page: 1, section: 'Schema Designs' },
    },
    {
      id: 'ch04-q11',
      difficulty: 'medium',
      question: 'Summing monthly sales to get yearly sales is an example of which OLAP operation?',
      options: [
        { id: 'a', text: 'Drill-down' },
        { id: 'b', text: 'Roll-up' },
        { id: 'c', text: 'Slice' },
        { id: 'd', text: 'Pivot' },
      ],
      correctOptionId: 'b',
      explanation:
        'Roll-up (aggregation) summarizes data by climbing up a concept hierarchy, here from months to years. Drill-down goes the other way, from summary to detail.',
      sourceReference: { sourceId: 'edw', page: 2, section: 'OLAP Operations (Online Analytical Processing)' },
    },
    {
      id: 'ch04-q12',
      difficulty: 'medium',
      question: 'A manager asks: "Show me sales for Time = 2023." Which OLAP operation fixes one dimension like this?',
      options: [
        { id: 'a', text: 'Dice' },
        { id: 'b', text: 'Roll-up' },
        { id: 'c', text: 'Drill-down' },
        { id: 'd', text: 'Slice' },
      ],
      correctOptionId: 'd',
      explanation: 'Slice selects a single value for one dimension to create a sub-cube. Dice would select values on several dimensions at once.',
      sourceReference: { sourceId: 'edw', page: 2, section: 'OLAP Operations (Online Analytical Processing)' },
    },
    {
      id: 'ch04-q13',
      difficulty: 'hard',
      question: '"Show me sales for Time = 2023 AND Product = Laptop AND Location = New York." Which OLAP operation is this?',
      options: [
        { id: 'a', text: 'Slice' },
        { id: 'b', text: 'Pivot' },
        { id: 'c', text: 'Roll-up' },
        { id: 'd', text: 'Dice' },
      ],
      correctOptionId: 'd',
      explanation:
        'Dice selects specific values for multiple dimensions. Fixing only Time = 2023 would be a slice; here three dimensions are restricted.',
      sourceReference: { sourceId: 'edw', page: 2, section: 'OLAP Operations (Online Analytical Processing)' },
    },
    {
      id: 'ch04-q14',
      difficulty: 'medium',
      question: 'A report shows products as rows and time as columns. Swapping them so time becomes the rows is which operation?',
      options: [
        { id: 'a', text: 'Dice' },
        { id: 'b', text: 'Pivot (rotate)' },
        { id: 'c', text: 'Drill-down' },
        { id: 'd', text: 'Partial materialization' },
      ],
      correctOptionId: 'b',
      explanation: 'Pivot rotates the data axes to view the data from a different perspective, such as swapping rows and columns. It does not filter or aggregate the data.',
      sourceReference: { sourceId: 'edw', page: 2, section: 'OLAP Operations (Online Analytical Processing)' },
    },
    {
      id: 'ch04-q15',
      difficulty: 'medium',
      question: 'In the middle (OLAP server) tier, how does MOLAP differ from ROLAP?',
      options: [
        { id: 'a', text: 'MOLAP stores no data; ROLAP stores all data in spreadsheets' },
        { id: 'b', text: 'MOLAP runs on the client; ROLAP runs on the bottom tier' },
        { id: 'c', text: 'MOLAP uses specialized array-based storage; ROLAP uses standard SQL' },
        { id: 'd', text: 'MOLAP is used only for OLTP; ROLAP only for OLAP' },
      ],
      correctOptionId: 'c',
      explanation:
        'ROLAP (relational OLAP) uses standard SQL, while MOLAP (multidimensional OLAP) uses specialized array-based storage. Both are OLAP servers in the middle tier.',
      sourceReference: { sourceId: 'edw', page: 3, section: 'Multi-tiered Architecture' },
    },
    {
      id: 'ch04-q16',
      difficulty: 'medium',
      question: 'In the business analysis design framework, which step chooses the schema (star vs. snowflake)?',
      options: [
        { id: 'a', text: 'Logical design' },
        { id: 'b', text: 'Conceptual design' },
        { id: 'c', text: 'Physical design' },
        { id: 'd', text: 'Requirements analysis' },
      ],
      correctOptionId: 'a',
      explanation:
        'Logical design chooses the schema. Conceptual design chooses the dimensions and measures, physical design decides hardware, indexing and partitioning, and requirements analysis identifies the business questions.',
      sourceReference: { sourceId: 'edw', page: 3, section: 'Business Analysis Design Framework' },
    },
    {
      id: 'ch04-q17',
      difficulty: 'medium',
      question: 'Which materialization strategy computes only a selected subset of cuboids, usually the most frequently used ones?',
      options: [
        { id: 'a', text: 'Full materialization' },
        { id: 'b', text: 'Partial materialization' },
        { id: 'c', text: 'No materialization' },
        { id: 'd', text: 'Join indexing' },
      ],
      correctOptionId: 'b',
      explanation:
        'Partial materialization balances storage space and query speed. Full materialization computes every cuboid (fast but huge); no materialization computes nothing in advance (small but very slow).',
      sourceReference: { sourceId: 'edw', page: 4, section: '3. Implementation: Efficient Computation of Data Cubes' },
    },
    {
      id: 'ch04-q18',
      difficulty: 'hard',
      question: 'For which kind of column is a bitmap index a good choice, according to the notes?',
      options: [
        { id: 'a', text: 'A low-cardinality column with few distinct values, such as Gender or Status' },
        { id: 'b', text: 'A column where every value is unique, such as a transaction ID' },
        { id: 'c', text: 'A column that stores the result of joining two tables' },
        { id: 'd', text: 'A free-text column such as customer comments' },
      ],
      correctOptionId: 'a',
      explanation:
        'A bitmap index creates one bit string per distinct value (Red: 10010, Blue: 01001), so it suits columns with few distinct values and allows fast AND/OR operations. Preserving a join is the job of a join index.',
      sourceReference: { sourceId: 'edw', page: 4, section: 'Indexing OLAP Data' },
    },
    {
      id: 'ch04-q19',
      difficulty: 'medium',
      question: 'According to the notes, where is ELT (Extract, Load, Transform) typically used?',
      options: [
        { id: 'a', text: 'Only in on-premise BI and data warehouse solutions' },
        { id: 'b', text: 'Only in OLTP checkout systems' },
        { id: 'c', text: 'Only for bitmap indexing' },
        { id: 'd', text: 'In cloud technologies and data lakes' },
      ],
      correctOptionId: 'd',
      explanation:
        'The notes pair ETL with on-premise BI / data warehouse solutions and ELT with cloud technologies and data lakes, where all data is loaded first and transformed later.',
      sourceReference: { sourceId: 'dwh-terms', section: 'Terminologies | ETL vs ELT' },
    },
    {
      id: 'ch04-q20',
      difficulty: 'hard',
      question: 'What is an operational data store (ODS)?',
      options: [
        { id: 'a', text: 'A landing zone used only during the ETL process' },
        { id: 'b', text: 'A fact table that stores yearly sales totals' },
        { id: 'c', text: 'A central database with a snapshot of the latest data from multiple transactional systems, for operational reporting' },
        { id: 'd', text: 'A front-end dashboard tool in the top tier' },
      ],
      correctOptionId: 'c',
      explanation:
        'An ODS provides a snapshot of the latest data from multiple transactional systems for operational reporting, and also feeds the enterprise data warehouse. A temporary ETL landing zone is a staging area.',
      sourceReference: { sourceId: 'dwh-terms', section: 'Terminologies | Staging vs ODS' },
    },
  ],
};
