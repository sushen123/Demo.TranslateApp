
<h2 >How to set up 💻</h2>

<ol>
  <li>Have a Rocket.Chat server ready. If you don't have a server, see this <a href="https://developer.rocket.chat/v1/docs/server-environment-setup">guide</a>.</li> 
  <li>Install the Rocket.Chat Apps Engline CLI. 
  
  ``` 
    npm install -g @rocket.chat/apps-cli
  ```
  
  Verify if the CLI has been installed 
  
  ```
  rc-apps -v
# @rocket.chat/apps-cli/1.4.0 darwin-x64 node-v10.15.3
  ```
  </li>
  <li>Clone the GitHub Repository</li>
    
 ```
    git clone https://github.com/sushen123/Demo.TranslateApp.git
 ```
  <li>Navigate to the repository</li>
    
 ```
    cd Demo.TranslateApp
 ```
  
  <li>Install app dependencies</li>
  
  ```
    cd app && npm install
  ```
  
  <li>To install private Rocket.Chat Apps on your server, it must be in development mode. Enable Apps development mode by navigating to <i>Administration > General > Apps</i> and turn on "Enable development mode".</li>
  
  <li>Deploy the app to the server </li>
  
  ```
  rc-apps deploy --url <server_url> --username <username> --password <password>
  ```
  
  - If you are running server locally, `server_url` is http://localhost:3000. If you are running in another port, change the 3000 to the appropriate port.
  - `username` is the username of your admin user.
  - `password` is the password of your admin user.

  <li> Open the App, by navigating to <i>Administration > Marketplace > Private Apps</i>. You should see the app listed there. Click on the App name to open the app.</li>

  <li> Select the <i>Settings</i> tab and enter the assembly api key and gemni llm key. </li>

</ol>