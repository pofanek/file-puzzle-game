import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Footer, Nav } from './components/layout'
import { FileProvider } from './lib/fileStore'
import { I18nProvider } from './lib/i18n'
import { ProgressProvider } from './lib/progress'
import Secret from './pages/Secret'
import Start from './pages/Start'
import { Nothing } from './secret/bits'

export default function App() {
  return (
    <I18nProvider>
      <ProgressProvider>
      <FileProvider>
        <HashRouter>
          <Nav />
          <main>
            <Routes>
              <Route path="/" element={<Start />} />
              <Route path="/finish" element={<Navigate to="/" replace state={{ scroll: 'finish' }} />} />
              <Route path="/s/:token/*" element={<Secret />} />
              <Route path="*" element={<Nothing />} />
            </Routes>
          </main>
          <Footer />
        </HashRouter>
      </FileProvider>
      </ProgressProvider>
    </I18nProvider>
  )
}
