import ProjectDetails from "@/components/projects/ProjectDetails";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ProjectDetails slug={slug} />;
}