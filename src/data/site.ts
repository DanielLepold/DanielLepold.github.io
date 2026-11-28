export const site = {
  name: 'Daniel Lepold',
  title: 'Daniel Lepold: Software for the built environment',
  description:
    'Computational structural engineer turned software engineer. AEC & BIM software, geospatial tooling, SDKs and cloud backends, and computer vision for sport science.',
  email: 'lepold.daniel@gmail.com',
  links: {
    github: 'https://github.com/DanielLepold',
    linkedin: 'https://www.linkedin.com/in/daniel-lepold-124a34a2',
    medium: 'https://medium.com/@daniel.lepold',
  },
};

export const nav = [
  { href: '/#about', label: 'About' },
  { href: '/#experience', label: 'Experience' },
  { href: '/#projects', label: 'Projects' },
  { href: '/#education', label: 'Education' },
  { href: '/#contact', label: 'Contact' },
];

export const stats = [
  { value: '12', unit: 'yrs', label: 'in engineering, since my first simulation job in 2014' },
  { value: '8+', unit: 'yrs', label: 'building production software' },
  { value: '5', unit: '', label: 'host platforms shipped: Revit, Rhino, SketchUp, QGIS, ArcGIS' },
];

/** The career arc shown under "About". */
export const arc = [
  { year: '2007', label: 'Structural engineering' },
  { year: '2014', label: 'Simulation' },
  { year: '2018', label: 'C++ FEM software' },
  { year: '2020', label: 'Backend' },
  { year: '2021', label: 'Cloud & BIM' },
  { year: '2024', label: 'Data science' },
  { year: '2025', label: 'AEC plugins & SDKs' },
  { year: '2026', label: 'Sport science' },
];

export const focus = [
  {
    title: 'AEC & BIM software',
    body: 'Revit add-ins and Dynamo workflows, Grasshopper/Rhino and SketchUp plugins, and the IFC, BCF, IDS and bSDD data pipelines behind them.',
    tags: ['Revit API', 'Dynamo', 'IFC', 'Grasshopper', 'SketchUp', 'C# / .NET'],
  },
  {
    title: 'Geospatial & climate data',
    body: 'QGIS and ArcGIS integrations, OGC API backends, and spatial pipelines for 3D buildings and raster/vector data, with validation, repair and CRS handling.',
    tags: ['QGIS', 'ArcGIS', 'GeoPandas', 'GDAL', 'Rasterio', 'OGC API'],
  },
  {
    title: 'SDKs, backends & cloud',
    body: 'Multi-language SDKs with a Rust core compiled for Python and .NET, versioned APIs with explicit contracts, and microservices running on Kubernetes.',
    tags: ['Rust', 'Python', 'C#', 'F#', 'Kubernetes', 'Azure / AWS'],
  },
  {
    title: 'Data science & computer vision',
    body: 'Detection and tracking, multi-view 3D reconstruction, ML on building data, RAG assistants, and the MLOps that takes models to production.',
    tags: ['PyTorch', 'YOLO', 'OpenCV', 'scikit-learn', 'MLflow', 'RAG'],
  },
];

/**
 * Career, grouped into the three areas. Roles with a `title` are the highlighted ones
 * and also get bullet points and tags.
 */
export const experience: {
  era: string;
  roles: {
    company: string;
    place: string;
    role: string;
    period: string;
    title?: string;
    body: string;
    points?: string[];
    tags?: string[];
  }[];
}[] = [
  {
    era: 'AEC software & data',
    roles: [
      {
        company: 'infrared.city',
        place: 'Vienna · hybrid',
        role: 'AEC Software Developer',
        period: 'May 2025 – present',
        title: 'Climate-tech AEC software from zero to production',
        body: 'I own infrared.city’s integrations across five host platforms: Revit, Grasshopper/Rhino, SketchUp, QGIS and ArcGIS. The work covers architecture, implementation, packaging, release and customer support, and brings AI-driven urban climate simulation (thermal comfort, wind, solar radiation) into the tools architects and planners already use.',
        points: [
          'Revit add-in published on the Autodesk App Store, plus a Dynamo workflow and a Claude skill (an LLM agent) that generates the Dynamo commands and guides users',
          'Shared SDKs for Python and .NET, built on a Rust core compiled for both runtimes',
          'OGC API–compliant backend APIs in Python: versioned endpoints, explicit contracts, scalable geometry processing',
          'Data pipelines for 3D buildings, ground materials and vegetation from Overture Maps, OpenStreetMap and Mapbox',
          'Godot Marathon AI simulator, a client project with Godot Inc. Japan and ASICS: I built the pipeline that tiles and aggregates our climate simulation results (heat, wind, shading) along the race route as input to their behavioural AI model of marathon runners',
        ],
        tags: ['C# / .NET', 'Python', 'Rust', 'Revit API', 'QGIS', 'ArcGIS', 'Grasshopper', 'SketchUp'],
      },
      {
        company: 'bimspot, acquired by smino',
        place: 'Vienna / Zürich · hybrid',
        role: 'Software Engineer',
        period: 'Nov 2021 – May 2025',
        title: 'A cloud-native BIM platform',
        body: 'I built microservices for a BIM collaboration platform that was acquired by smino (Zürich) along the way. The platform was built on buildingSMART open standards (IFC, BCF, IDS, bSDD) and deployed with Kubernetes on AWS and Azure.',
        points: [
          'Microservices in .NET Core, F# and Node.js with Helm, Flux, Argo Workflows and RabbitMQ, monitored with Grafana and Sentry',
          'A production RAG assistant over project documents, 2D plans and contracts (Azure AI Search, vector index)',
          'Embodied-CO₂ prediction from IFC models, plus analytics dashboards for management, product and sales',
          'Deep learning for image classification and segmentation',
        ],
        tags: ['F#', 'C# / .NET', 'Node.js', 'Kubernetes', 'IFC', 'RAG'],
      },
    ],
  },
  {
    era: 'Software engineering',
    roles: [
      {
        company: 'Art of info',
        place: '',
        role: 'Software Engineer',
        period: 'Mar 2020 – Nov 2021',
        body: 'Backend services in C#/ASP.NET, SQL Server and Python, including a DICOM gateway for MRI/CT transmission; industrial software and automated test systems for a cable harness factory (LEAR Corporation).',
      },
      {
        company: 'Consteel Solutions',
        place: '',
        role: 'Software Engineer',
        period: 'Jan 2018 – Mar 2020',
        title: 'Finite element software in C++',
        body: 'I worked on a finite element CAD/CAE desktop application for structural engineers: the mechanical and mathematical routines, linear algebra, numerical correctness and performance.',
        tags: ['C++', 'FEM', 'Linear algebra'],
      },
    ],
  },
  {
    era: 'Engineering simulation',
    roles: [
      {
        company: 'Econ Engineering',
        place: '',
        role: 'Simulation Engineer',
        period: 'Oct 2014 – Jul 2017',
        body: 'Automotive and industrial FE simulation: static, non-linear, dynamic, fatigue, thermal and crash. Python scripting for data exchange and automated result evaluation; 3D digital twin models.',
      },
    ],
  },
];

export const education = [
  {
    degree: 'MSc, Sport Performance Analytics',
    school: 'Hungarian University of Sport Science',
    period: '2026 – present',
    notes: [
      'Research focus: video-based kinematic measurement of athletes',
      'Student research (TDK): hammer-throw release parameters from competition video. 1st place in the Biomechanics section of the TDK conference',
    ],
  },
  {
    degree: 'Postgraduate degree, Data Science & AI Solution Development',
    school: 'University of Pannonia',
    period: '2024 – 2025',
    notes: ['Grade: Excellent', 'Thesis: Analyses and prediction of embodied CO₂ of building structures'],
  },
  {
    degree: 'MSc, Computational Structural Engineering',
    school: 'Budapest University of Technology and Economics',
    period: '2012 – 2014',
    notes: [
      'Taught in English · Grade: Excellent',
      'Thesis: mechanical modelling of the impact of human chest blows (biomechanical FE model in ANSYS)',
      'Student research (TDK): numerical analysis of a cable drum considering material non-linearity',
    ],
  },
  {
    degree: 'BSc, Structural Engineering',
    school: 'Budapest University of Technology and Economics',
    period: '2007 – 2012',
    notes: [],
  },
];

export const toolbox = [
  { group: 'Languages', items: ['C#', 'F#', 'Python', 'Rust', 'C++', 'TypeScript / Node.js', 'SQL'] },
  {
    group: 'AEC & BIM',
    items: ['Revit API', 'Dynamo', 'IFC / IfcOpenShell', 'BCF', 'IDS', 'bSDD', 'Grasshopper / Rhino', 'SketchUp'],
  },
  {
    group: 'Simulation & CAE',
    items: ['FEM', 'CAE', 'CAD', 'ANSYS', 'LS-DYNA', 'ANSA', 'MATLAB', 'SolidWorks', 'AxisVM', 'Consteel'],
  },
  {
    group: 'Geospatial',
    items: ['QGIS', 'ArcGIS Pro SDK', 'GeoPandas', 'Shapely', 'Rasterio', 'GDAL / OGR', 'PyProj', 'xarray', 'OGC API'],
  },
  {
    group: 'ML & vision',
    items: ['PyTorch', 'TensorFlow', 'Ultralytics YOLO', 'OpenCV', 'scikit-learn', 'pandas', 'Spark', 'RAG / LLM agents'],
  },
  {
    group: 'Cloud & delivery',
    items: ['Docker', 'Kubernetes', 'Helm', 'Flux', 'Argo Workflows', 'RabbitMQ', 'Terraform', 'AWS', 'Azure', 'MLflow', 'Grafana', 'Sentry', 'CI/CD'],
  },
];

export const spoken = [
  { lang: 'English', level: 'Full professional' },
  { lang: 'German', level: 'Professional working' },
  { lang: 'Hungarian', level: 'Native' },
];
