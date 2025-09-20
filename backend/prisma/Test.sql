-- Lösche alte Daten (optional, nur für lokale Tests!)
TRUNCATE TABLE "Technology" RESTART IDENTITY CASCADE;

-- Beispiel-Technologien, alle publiziert (publishedAt gesetzt)
INSERT INTO "Technology" (
  id, name, category, ring, "techDescription", "ringDescription", "createdAt", "publishedAt"
) VALUES
  (gen_random_uuid(), 'ArgoCD', 'Tools', 'Trial',
   'Argo CD is a declarative, GitOps continuous delivery tool for Kubernetes.',
   'Wir empfehlen Argo CD für Deployment und Monitoring in Kubernetes-Umgebungen.',
   now(), now()),

  (gen_random_uuid(), 'Kubernetes', 'Platforms', 'Adopt',
   'Kubernetes is an open-source container orchestration platform.',
   'Kubernetes ist bei uns Standard für Container-Orchestrierung und sollte breit eingesetzt werden.',
   now(), now()),

  (gen_random_uuid(), 'Angular', 'LanguagesFrameworks', 'Adopt',
   'Angular is a TypeScript-based web application framework.',
   'Angular ist unser primäres Frontend-Framework für komplexe Anwendungen.',
   now(), now()),

  (gen_random_uuid(), 'Rust', 'LanguagesFrameworks', 'Assess',
   'Rust is a systems programming language focused on safety and performance.',
   'Rust evaluieren wir aktuell für sicherheitskritische Backend-Services.',
   now(), now()),

  (gen_random_uuid(), 'Domain-Driven Design', 'Techniques', 'Trial',
   'DDD is an approach to software development that emphasizes collaboration and modeling.',
   'DDD-Techniken nutzen wir verstärkt in neuen Projekten, um komplexe Domänen beherrschbar zu machen.',
   now(), now()),

  (gen_random_uuid(), 'Another Technique', 'Techniques', 'Trial',
   'Description.',
   'Description.',
   now(), now());

-- Beispiel für einen Draft (nicht publiziert, publishedAt = NULL)
INSERT INTO "Technology" (
  id, name, category, ring, "techDescription", "ringDescription", "createdAt", "publishedAt"
) VALUES
  (gen_random_uuid(), 'CoolNewTool', 'Tools', 'Assess',
   'Ein spannendes neues Tool, das wir noch evaluieren.',
   'Noch keine offizielle Empfehlung – Draft!',
   now(), NULL);
