/**
 * Template re-mounts on navigation.
 * Анимации переходов живут в PageTransition (layout),
 * чтобы AnimatePresence корректно обрабатывал exit → enter.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
