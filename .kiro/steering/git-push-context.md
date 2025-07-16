---
inclusion: manual
contextTrigger: "push to git"
---

# Git Push Context Rule

## Automatic Context Inclusion

When the user says "push to git" or similar git push commands, automatically include the commit message guidelines as context to ensure proper commit formatting.

## Trigger Phrases
- "push to git"
- "git push"
- "commit and push"
- "push changes"
- "push to repository"
- "commit to git"

## Required Actions

1. **Always reference commit-messages.md**: Include the commit message guidelines from `.kiro/steering/commit-messages.md`
2. **Generate proper commit message**: Create a conventional commit message with appropriate emoji
3. **Stage changes**: Add all relevant files to git staging
4. **Commit with message**: Use the generated conventional commit message
5. **Push to remote**: Push the committed changes to the remote repository

## Commit Message Requirements

- Follow conventional commit format with emojis
- Use appropriate type (feat, fix, docs, etc.)
- Include scope when relevant
- Keep description under 50 characters
- Use imperative mood
- No period at end of description

## Example Workflow

When user says "push to git":
1. Analyze changed files to determine commit type and scope
2. Generate conventional commit message with emoji
3. Execute git commands:
   ```fish
   git add .
   git commit -m "<generated_message>"
   git push
   ```

This rule ensures consistent, professional commit messages every time the user wants to push changes to git.