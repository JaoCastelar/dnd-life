# D&D Life Counter

## ⚙️ Requisitos

Antes de começar, certifique-se de ter os seguintes softwares instalados:

- [Node.js (LTS)](https://nodejs.org/)
- npm (vem com o Node.js)
- [Git](https://git-scm.com/)
- Yarn (opcional): `npm install -g yarn`
- **Expo Go** no celular (Android/iOS)

---

## 🐧 Linux

### 1. Instalar Node.js, npm e Git

```bash
sudo apt update
sudo apt install nodejs npm git -y

# Verifique as versões
node -v
npm -v
git --version
```

### 2. Instalar Expo CLI globalmente

```bash
npm install -g expo-cli
# ou
yarn global add expo-cli
```

### 3. Clonar o repositório do projeto

```bash
git clone https://github.com/usuario/nome-do-projeto.git
cd nome-do-projeto
```

### 4. Instalar as dependências do projeto

```bash
npm install
# ou
yarn install
```

### 5. Iniciar o projeto

```bash
npx expo start
# ou
expo start
```

---

## 🪟 Windows

### 1. Instalar Node.js

- Baixe o instalador do Node.js (versão LTS): [https://nodejs.org](https://nodejs.org)
- Siga o assistente de instalação, incluindo a opção para adicionar ao PATH.

### 2. Verificar instalação

Abra o **Prompt de Comando** ou **PowerShell**:

```bash
node -v
npm -v
```

### 3. Instalar o Git

- Baixe e instale o Git: [https://git-scm.com](https://git-scm.com)

### 4. Instalar o Expo CLI

```bash
npm install -g expo-cli
# ou
yarn global add expo-cli
```

### 5. Clonar o repositório do projeto

```bash
git clone https://github.com/usuario/nome-do-projeto.git
cd nome-do-projeto
```

### 6. Instalar as dependências

```bash
npm install
# ou
yarn install
```

### 7. Iniciar o projeto

```bash
npx expo start
# ou
expo start
```

---

## 📲 Executar no Celular (Expo Go)

1. Instale o app **Expo Go** no seu smartphone (Play Store ou App Store).
2. Após rodar `expo start`, escaneie o QR Code com o Expo Go.
3. Use a opção **Tunnel** no terminal se estiver em uma rede com NAT ou firewall.

---

## 💻 Executar no Emulador Android

1. Instale o **Android Studio**.
2. Crie um emululador virtual (AVD).
3. Inicie o emulador.
4. No terminal do Expo (`expo start`), pressione `a` para abrir no emulador Android.

---

## 🛠️ Solução de Problemas

- Verifique se as portas 19000 e 19001 estão abertas.
- Use `expo doctor` para checar problemas de ambiente.
- Use a opção **Tunnel** se o app não conectar no celular físico.
- Reinicie o terminal ou computador após instalar o Node.js (no Windows).
