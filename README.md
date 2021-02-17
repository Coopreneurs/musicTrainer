# React Native App - Music Trainer
## How to install
- open console
- cd into your workspace directory 
- clone repo
- ``cd musicTrainer``
- install expo
- ``yarn install`` (this will take a while) 

## How to run
- open console
- cd into your workspace directory 
- ``cd musicTrainer``
- ``yarn start``

## How to change stuff
- open console
- cd into your workspace directory 
- ``cd musicTrainer``
- ``git checkout main``
- ``git pull``
- ``git checkout -b "<Name>sFirstBranch"``
- Open Code editor 
- Code like a Hero 
- Save all files 
- Check if its still running in the Browser window without throwing errors 
- Confirm by refreshing the Browser window and looking at what you've changed 
- in the console, type ``git add .``
- ``git commit -m "<Describe what you did in less than 20 words>"``
- ``git push origin <Name>sFirstBranch``
- Go to GitHub and open a PR for your branch

## Folder structure

<pre>
<b>musicTrainer</b>
├── <b>Assets</b>
│   │   <i>SVG files do not work on native devices if not converted into</i>
│   │   <i>.js (JSX) files utilizing 'react-native-svg' components.</i> 
│   └── &lt;Other Static Asset Files&gt;
├── <b>Components</b>
│   ├── index.js (exporting all Components, add new Components here!)
│   ├── &lt;ComponentName&gt;.js (One-file Components)
│   └── &lt;ComponentName&gt; (Multi-file Components)
│       ├── index.js (Exporting the Component) 
│       └── &lt;Other files (not shared!)&gt;
├── <b>Screens</b>
│   ├── &lt;<b>ScreenName</b>&gt; 
│   │   ├── &lt;ScreenName&gt;.js
├── <b>MusicTheory</b>
│   ├── intervals.js 
│   ├── notes.js 
│   └── <b>index.js</b> (Exports)
├── <b>Trainings</b>
│   ├── index.js (exporting all Trainings, add new Trainings here!)
│   ├── &lt;trainingName&gt;.js (One-file Trainings)
│   └── &lt;trainingName&gt; (Multi-file Components)
│       ├── index.js (Exporting the Component) 
│       └── &lt;Other files (not shared!)&gt;
├── App.js (App Root Component)
├── (Other Stuff)
</pre>