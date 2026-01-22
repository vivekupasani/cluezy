import { ReactNode, Suspense } from 'react'

import { ArtifactProvider } from './artifact-context'
import { ChatArtifactContainer } from './chat-artifact-container'

export default function ArtifactRoot({ children }: { children: ReactNode }) {
  return (
    <ArtifactProvider>
      <Suspense fallback={null}>
        <ChatArtifactContainer>{children}</ChatArtifactContainer>
      </Suspense>
    </ArtifactProvider>
  )
}
