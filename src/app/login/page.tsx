import { LoginForm, LoginBrand } from "@/components/login/LoginForm";

interface PageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function LoginPage({ searchParams }: PageProps) {
  const { next } = await searchParams;

  return (
    <main className="flex-grow flex flex-col items-center justify-center px-margin-mobile py-xl min-h-[70vh]">
      <LoginBrand />
      <LoginForm next={next ?? "/intake"} />
    </main>
  );
}
