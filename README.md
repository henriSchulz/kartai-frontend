# KartAI Frontend

KartAI ist eine intelligente Karteikarten-App, die das Lernen leichter macht. Mit KartAI kannst du effizienter lernen
und mehr Wissen aufnehmen. Dank unseren effizienten Algorithmen kannst du deine Lernzeit minimieren. KartAI basiert auf
spaced repetition, einer bewährten Lernstrategie, die Ihr Gedächtnis gezielt stärkt. KartAI kann benutzt werden um:

## Features

- **Lernalgorithmen**: Unser Algorithmus identifiziert anhand der Vergessenskurve Inhalte, die sich an der Schwelle des
  Vergessens befinden könnten, und präsentiert dir diese gezielt. So unterstützen wir dich dabei, wichtige Informationen
  in deinem Gedächtnis zu bewahren und dem Vergessen zu entgehen.
- **Individualität**: KartAI ermöglicht freie Anpassungen. Du kannst Karten nach Belieben bearbeiten und verschiedene
  Kartentypen und Varianten erstellen.
- **KI-Karten**: Durch die nahtlose Verknüpfung von KartAI mit den Services von OpenAI ermöglichen wir die Nutzung der
  leistungsstarken künstlichen Intelligenz von KartAI zur Generierung von hochwertigen Inhalten und Lernmaterialien.
- **KartAI-Cloud**: Die automatische Speicherung in der KartAI-Cloud gewährleistet, dass deine Karten stets
  synchronisiert sind und auf all deinen Geräten in vollem Umfang verfügbar sind, unabhängig von Ort oder Zeitpunkt.

## Installation

Um die App zu installieren, führen Sie die folgenden Schritte aus:

0. Installieren Sie KartAI Backend

1. Klonen Sie das Repository:

```git clone https://github.com/henriSchulz/kartai-frontend.git```

2. Wechseln Sie in das Verzeichnis des geklonten Repositorys:

```cd kartai-frontend```

3. Installieren Sie die Abhängigkeiten:

```npm install```


4. Fügen Sie ihre `src/config/firebaseConfig.ts` hinzu:

```typescript
import {initializeApp} from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider()
export {auth, provider}
```

5. Starten Sie die App:

```npm start```

## Lizenz

Dieses Projekt steht unter der MIT-Lizenz.