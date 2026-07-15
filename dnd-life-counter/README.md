# D&D Life Counter

## ⚙️ Requisitos

Antes de começar, certifique-se de ter os seguintes softwares instalados:

- Node.js (LTS): https://nodejs.org/
- npm (vem com o Node.js)
- Git: https://git-scm.com/
- Yarn (opcional): npm install -g yarn
- Expo Go no celular (Android/iOS)

------------------------------------------------------------
🐧 LINUX
------------------------------------------------------------

# 1. Instalar Node.js, npm e Git
sudo apt update
sudo apt install nodejs npm git -y

# Verificar versões
node -v
npm -v
git --version

# 2. Instalar Expo CLI globalmente
npm install -g expo-cli
# ou
yarn global add expo-cli

# 3. Instalar EAS CLI
npm install -g eas-cli
# ou
yarn global add eas-cli

# 4. Clonar o repositório
git clone https://github.com/usuario/nome-do-projeto.git
cd nome-do-projeto

# 5. Instalar dependências
npm install
# ou
yarn install

# 6. Iniciar o projeto
npx expo start
# ou
expo start

# 7. Fazer login no EAS
eas login

# 8. Gerar build APK
eas build -p android --profile production


------------------------------------------------------------
🪟 WINDOWS
------------------------------------------------------------

# 1. Instalar Node.js
# Baixar de: https://nodejs.org/

# 2. Verificar instalação
node -v
npm -v

# 3. Instalar Git
# Baixar de: https://git-scm.com

# 4. Instalar Expo CLI
npm install -g expo-cli
# ou
yarn global add expo-cli

# 5. Instalar EAS CLI
npm install -g eas-cli
# ou
yarn global add eas-cli

# 6. Clonar o repositório
git clone https://github.com/usuario/nome-do-projeto.git
cd nome-do-projeto

# 7. Instalar dependências
npm install
# ou
yarn install

# 8. Iniciar o projeto
npx expo start
# ou
expo start

# 9. Fazer login no EAS
eas login

# 10. Gerar build APK
eas build -p android --profile production


------------------------------------------------------------
📲 Executar no Celular (Expo Go)
------------------------------------------------------------

# 1. Instalar Expo Go (Play Store / App Store)
# 2. Rodar expo start
# 3. Escanear QR Code com o Expo Go
# 4. Usar modo Tunnel se necessário


------------------------------------------------------------
💻 Executar no Emulador Android
------------------------------------------------------------

# 1. Instalar Android Studio
# 2. Criar um AVD (emulador)
# 3. Iniciar o emulador
# 4. Pressionar "a" no terminal do Expo


------------------------------------------------------------
🏗️ Gerar Build (APK) com EAS
------------------------------------------------------------

# Necessário:
# - eas-cli instalado
# - estar logado no EAS
# - eas.json configurado com:

# "production": {
#   "autoIncrement": true,
#   "android": {
#     "buildType": "apk"
#   }
# }

# Comando:
eas build -p android --profile production


------------------------------------------------------------
🛠️ Solução de Problemas
------------------------------------------------------------

# Verificar portas 19000 e 19001
# Rodar expo doctor para validar ambiente
# Reiniciar PC após instalar Node.js (Windows)
# Inspecionar erro de build:
eas build:inspect
