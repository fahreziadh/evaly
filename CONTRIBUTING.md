# Contributing to Evaly

Thank you for considering contributing to this project! We welcome pull requests, bug reports, feature suggestions, and any help to improve this project.

Please take a moment to review this document to make the contribution process easy and effective for everyone.

---

## Code of Conduct

Please follow our [CODE\_OF\_CONDUCT.md](./CODE_OF_CONDUCT.md) to ensure a welcoming and respectful environment.

---

## Getting Started

1. **Fork the repository**
2. **Clone your fork**

   ```bash
   git clone https://github.com/your-username/project-name.git
   ```
3. **Install dependencies**

   Follow the setup instructions in the `README.md` file to get started locally.

---

## Branch Naming Convention

Please follow this naming convention when creating a new branch:

```
<type>/<short-description>
```

**Types**:

* `feature` – for new features
* `fix` – for bug fixes
* `docs` – for documentation-only changes
* `refactor` – for code refactoring that doesn’t add features or fix bugs
* `test` – for adding or updating tests
* `chore` – for maintenance work like updating dependencies

**Examples**:

* `feature/add-login-page`
* `fix/handle-null-user`
* `docs/update-readme`
* `refactor/auth-middleware`

---

## Commit Message Guidelines

Follow this pattern for clear and meaningful commit messages:

```
<type>: <short description>
```

**Examples**:

* `feat: add OAuth login`
* `fix: handle null pointer on dashboard load`

For more structured commit messages, consider using [Conventional Commits](https://www.conventionalcommits.org/).

---

## Code Standards

* Follow the coding style used in the repository.
* Lint your code before committing (e.g., ESLint, Prettier, etc).
* Include comments where necessary.
* Keep pull requests focused and minimal.
* Write or update tests if your code affects core functionality.

---

## Pull Request Checklist

Before submitting a pull request:

* [ ] Ensure your branch is up-to-date with `main` or the target branch
* [ ] Lint your code
* [ ] Add/update documentation (if applicable)
* [ ] Add/update tests (if applicable)
* [ ] Ensure the CI pipeline (if any) passes

---

## Reporting Bugs

Please open an issue with the following details:

* **Description** of the bug
* **Steps to reproduce**
* **Expected vs actual behavior**
* **Screenshots or logs** (if available)

Use the issue template if available.

---

## Feature Requests

We welcome new ideas! Please open an issue to discuss your idea before starting to work on it.

---

## License

By contributing to the Evaly, you agree that your contribution will be licensed under the following [GNU Affero General Public License v3.0](./LICENSE.md).