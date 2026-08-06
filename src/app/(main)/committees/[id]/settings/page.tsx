import { getCommitteeById } from "@/actions/committee.actions";
import { getCommitteeMembers } from "@/actions/member.actions";
import SettingsForm from "./SettingsForm";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CommitteeSettingsPage({ params }: PageProps) {
  const { id } = await params;
  const committee = await getCommitteeById(id);
  const members = await getCommitteeMembers(id);

  if (!committee) {
    notFound();
  }

  return <SettingsForm committee={committee} members={members} committeeId={id} />;
}
