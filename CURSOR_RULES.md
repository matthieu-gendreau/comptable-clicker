# Cursor Rules

## Code Quality Check Rule

**When to apply:**
After any series of code modifications including:
- Adding or modifying features
- Bug fixes
- Refactoring
- Project structure changes
- Adding or modifying tests

**Mandatory steps:**
1. Run `npm run check` which sequentially executes:
   - TypeScript verification (`tsc --noEmit`)
   - ESLint checks (`eslint .`)
   - Vitest tests (`vitest --run`)

2. Verify that:
   - No TypeScript errors are present
   - No ESLint warnings are detected
   - No ESLint errors are detected
   - All tests pass successfully

**Important restrictions:**
- ❌ It is FORBIDDEN to:
  - Modify ESLint configuration to hide errors/warnings
  - Disable TypeScript rules
  - Add comments to ignore errors (`// @ts-ignore`, `// eslint-disable`, etc.)
  - Commit code that doesn't pass these verifications

**If checks fail:**
When `npm run check` reveals issues:
1. Note all detected problems
2. Fix each issue at its source
3. Re-run `npm run check` until everything passes
4. Only then proceed with committing changes

**Example of correct workflow:**
```bash
# 1. Make necessary changes
# 2. Run verifications
npm run check

# 3. If issues are detected:
#    - Fix the issues
#    - Re-run npm run check
#    - Repeat until everything is green

# 4. Only when everything is green:
git add .
git commit -m "feat: description of changes"
```

This rule must be followed rigorously to maintain code quality and prevent technical debt accumulation. Each team member is responsible for ensuring their code passes all verifications before committing. 