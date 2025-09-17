# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-09-17

### Added
- 🎉 **Initial release** of Classeviva.js
- 📦 **Complete JavaScript/Node.js wrapper** for Classeviva API
- 🏗️ **ES6+ module system** with import/export
- 🔄 **Full async/await API** with Promise-based architecture
- 👤 **Utente class** with comprehensive API coverage:
  - Authentication and session management
  - Grades (`voti()`)
  - Absences (`assenze()`, `assenzeDa()`, `assenzeDaA()`)
  - Agenda (`agenda()`, `agendaDaA()`)
  - Documents (`documenti()`, `pagelle()`)
  - Notes (`note()`, `leggiNota()`)
  - Noticeboard (`bacheca()`, `bachecaLeggi()`)
  - Lessons (`lezioni()`, `lezioniGiorno()`)
  - Student card (`carta()`)
  - School books (`libri()`)
  - Avatar (`avatar()`)
  - Overview (`panoramicaDaA()`)
- 👥 **ListaUtenti class** for batch operations:
  - Concurrent login for multiple users
  - Batch data retrieval (`votiTutti()`, `assenzeTutti()`)
  - Automatic duplicate removal
  - Filtering and mapping utilities
- ⚠️ **Comprehensive error handling**:
  - Custom exception hierarchy
  - HTTP error management
  - Date validation errors
  - Authentication errors
- 📅 **Date utilities**:
  - Automatic date validation
  - School year calculations
  - Format conversion (YYYY-MM-DD ↔ YYYYMMDD)
- 🔗 **Collegamenti class** with all API endpoints
- 🔧 **Constants and utilities** in variabili module
- 📖 **Comprehensive documentation**:
  - Detailed README with examples
  - JSDoc comments throughout
  - Contributing guidelines
  - Professional GitHub setup
- 🚀 **GitHub Actions CI/CD**:
  - Multi-version Node.js testing (16, 18, 20, 22)
  - Security auditing
  - Syntax validation
- 💡 **Usage examples** and starter templates
- 🛡️ **Security best practices**:
  - Credentials protection via .gitignore
  - Environment variables support
  - No hardcoded secrets

### Technical Details
- **Node.js**: ≥16.0.0 required
- **Dependencies**: axios for HTTP requests
- **Module system**: ES6 modules (`"type": "module"`)
- **License**: MIT
- **Language**: JavaScript with Italian documentation (matching target audience)

### Conversion Notes
This release represents a complete port from the original Python library:
- **Original**: [Classeviva Python wrapper](https://github.com/Lioydiano/Classeviva)
- **API Documentation**: [Official endpoints](https://github.com/Lioydiano/Classeviva-Official-Endpoints)
- **Maintained compatibility** with original API structure
- **Enhanced with modern JavaScript** patterns and best practices

---

## Future Releases

### Planned Features
- TypeScript definitions
- React/Vue.js integration helpers
- CLI tool
- Enhanced testing suite
- Performance optimizations
- Additional API endpoints as they become available

### Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on contributing to this project.

---

**Note**: This project is not affiliated with Spaggiari Group. It's an independent wrapper for educational purposes.