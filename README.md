# IT Inventory System

Aplicação web open source e responsiva que provê um sistema completo para gerenciar a parte informatizada do inventário de uma empresa, além de seus colaboradores e clientes.

A solução, como está no repositório, foi feita para uma empresa generica e ficticia de TI. Todos os valores e identidade visual podem ser alterados no código para se adequar à outras necessidades.

## Páginas e funcionalidades

### Páginas

- Página de Configuração Inicial
  - Interface gráfica que permite que o sistema seja configurado pela primeira vez.
- Página de Login
  - Exibida ao tentar acessar qualquer página do sistema sem estar autenticado. Controla o acesso ao sistema por meio de credenciais.
- Dashboard
  - Mostra as principais informações inseridas na aplicação através de gráficos.
- Gerenciamento de Estoque
  - Mostra as informações de todos os produtos no inventário da empresa e permite operações "CRUD" sobre estes.
- Movimentação de Estoque
  - Permite a entrada e saída de produtos do estoque e mostra as movimentações mais recentes neste.
- Gerenciamento de clientes
  - Gerencia os clientes cadastrados no sistema. Estes, que não possuem acesso à aplicação, são usados pelos colaboradores para registros de ordens de serviço.
- Gerenciamento de Usuários
  - Acessível somente para administradores, permite que estes controlem os usuários (colaboradores) que possuem acesso à aplicação através do login.
- Gerenciamento de Ordens de Serviço
  - Mostra e permite a inserção de Ordens de Serviço no sistema, que são prestadas por um técnico (Usuário) à um Cliente e podem consumir Produtos do Estoque.
- Página do Perfil
  - Exibe as informações do Usuário logado e permite que este altere sua senha.
 
 ### Funcionalidades

 - Autenticação
   - Controla o acesso de forma segura e criptografada ao sistema. A sessão do usuário permanece ativa entre acessos.
- Emissão de Ordens de Serviço
  - Permite que Ordens de Serviço sejam exportadas para PDF.
- Interface responsiva e intuitiva
  - Páginas com alta usabilidade e *design* que se adapta à diferentes dispositivos.

## Tecnologias

Utiliza React + TypeScript para construir o *front-end* da solução. O *back-end* foi implementado utilizando .NET 8.0 + C#, que utiliza o Entity Framework para acessar o banco de dados no SQL Server. A autenticação é feita através de JWT, enquanto o *front-end* se comunica com o *back-end* através de APIs REST.

## Autores

- [Allan Bastos da Silva](https://github.com/allan-bastos)
- [Mateus Carvalho Lucas](https://github.com/Teuscl)
- [Victor Probio Lopes](https://github.com/VictorPLopes)
- [Wilson Bin Rong Luo](https://github.com/Volcanogamer)
