import QuestGeneratorPage from "./QuestGeneratorPage";

function SharedQuestPage() {
  const params = new URLSearchParams(window.location.search);
  const data = params.get("data");

  if (!data) return <div>No quest data found.</div>;

  let quest;
  try {
    quest = JSON.parse(atob(decodeURIComponent(data)));
    console.log("Decoded quest:", quest);

  } catch {
    return <div>Invalid quest data.</div>;
  }

  return (
    <QuestGeneratorPage
      initialQuest={quest}
      readOnly={true}
      sender = {quest.sender} //references sender of shared quest
    />
  );
}

export default SharedQuestPage;
