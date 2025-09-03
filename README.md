# ♻️ Orbitar

Plataforma web para doação sustentável de produtos eletrônicos e outros itens, com foco na redução do impacto ambiental e incentivo à reutilização. Desenvolvida em C#, Angular e SQL Server.

---

## Objetivo do Projeto

Criar um sistema simples e acessível para que qualquer pessoa possa se cadastrar, doar equipamentos em boas condições ou receber aqueles que precisa, de forma prática e sustentável.

---

## Tecnologias Utilizadas (previstas)

- **Front-end:** Angular  
- **Back-end:** C# (.NET Core / ASP.NET)  
- **Banco de Dados:** Microsoft SQL Server (gerenciado via SSMS)  
- **Controle de Versão:** Git + GitHub  

---

## Requisitos de Negócio

1. **Cadastro Único de Usuário**  
   - Qualquer pessoa pode se cadastrar na plataforma.  
   - O usuário pode atuar como **doador** ou **receptor**, sem restrições.  
   - Campos obrigatórios: nome, e-mail, senha e cidade.  

2. **Gestão de Produtos**  
   - Usuários podem cadastrar produtos que desejam doar.  
   - Campos obrigatórios: nome do produto, imagem, categoria, estado de conservação (bom estado, seminovo, com defeito), observações e endereço de entrega.  
   - Cada produto deve ser associado à **cidade do doador**.  
   - Usuários só podem visualizar produtos **da mesma cidade**, facilitando a logística de entrega.  

3. **Reserva de Produtos**  
   - Um receptor pode reservar produtos disponíveis.  
   - Produtos reservados ficam indisponíveis para outros usuários **por 7 dias**.  
   - Caso a doação seja concluída, o produto é marcado como **Doado** e removido do catálogo.  
   - Se a reserva expirar sem a doação, o produto volta automaticamente a **Disponível**.  

4. **Entrega do Produto**  
   - O doador define como será a entrega (endereço ou ponto de encontro).  
   - Após a entrega, o item deve ser marcado como **Doado**.  

5. **Controle de Conteúdo de Imagens**  
   - A plataforma deve impedir o cadastro de imagens impróprias ou ofensivas.  
   - As imagens devem ser verificadas antes de ficarem disponíveis no catálogo (automático ou futuro processo de moderação manual).  

6. **Comunicação Segura (futuro)**  
   - Chat interno para combinar entrega sem expor dados pessoais, garantindo a privacidade dos usuários.  

7. **Transparência e Sustentabilidade**  
   - Relatórios sobre impacto ambiental: quantidade de doações realizadas e eletrônicos reaproveitados.

---

## Requisitos de Usuário (Jornada)

1. **Cadastro/Login**  
   - O usuário cria conta ou faz login com nome, e-mail, senha e cidade.  
   - E-mail válido e senha segura (mínimo 6-8 caracteres).  

2. **Acesso ao Catálogo**  
   - Apenas produtos **da mesma cidade** do usuário são exibidos.  
   - Filtrar por categoria e estado de conservação.  

3. **Cadastro de Produto**  
   - Cadastrar item para doação com nome, categoria, condição, observações, imagem e endereço de entrega.  
   - Produto fica visível no catálogo como **Disponível**.  

4. **Reserva de Produto**  
   - Usuário reserva um produto; status muda para **Reservado** por 7 dias.  
   - Após 7 dias sem conclusão, a reserva é cancelada automaticamente e o produto retorna a **Disponível**.  
   - O doador pode marcar o produto como **Doado** a qualquer momento.  

5. **Gerenciar Minhas Doações**  
   - Editar, remover ou marcar produto como entregue.  

6. **Chat (futuro)**  
   - Sistema de mensagens entre doador e receptor para combinar entrega, mantendo privacidade.  

---

## 📄 Licença

Este projeto está sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.
