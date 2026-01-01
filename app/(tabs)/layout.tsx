import BottomNavbar from "@/components/BottomNavbar";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function TabsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute>
      <div>
        {children}
        <BottomNavbar />
      </div>
    </ProtectedRoute>
  );
}
