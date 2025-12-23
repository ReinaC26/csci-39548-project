import QuestGeneratorPage from "./QuestGeneratorPage";

function decodeQuest(str) {
  const base64 = str
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  return JSON.parse(atob(base64));
}

function SharedQuestPage() {
  const params = new URLSearchParams(window.location.search);
  const data = params.get("data");

  if (!data) return <div>No quest data found.</div>;

  let quest;
  try {
    quest = decodeQuest(data);
    console.log("Decoded quest:", quest);
  } catch (err) {
    console.error("Quest decode failed", err);
    return <div>Invalid quest data.</div>;
  }

  return (
    <QuestGeneratorPage
      initialQuest={{    
        startLocation: quest.startLocation,
        endLocation: quest.endLocation,
        distance: quest.distance,
        duration: quest.duration,
        description: quest.description,
        questGoal: quest.questGoal,
        completed: true,}}
      readOnly
      sender={quest.sender}
    />
  );
}

export default SharedQuestPage;
