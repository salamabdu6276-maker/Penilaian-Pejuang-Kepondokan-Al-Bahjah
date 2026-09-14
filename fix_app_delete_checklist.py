import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add handleDeleteChecklist
delete_checklist_code = """  const handleDeleteChecklist = async (id: string) => {
    await deleteChecklistSubmission(id);
    setSubmissions(prev => prev.filter(s => s.id !== id));
  };

  const handleDeleteAllChecklistsByMonth"""

content = content.replace("  const handleDeleteAllChecklistsByMonth", delete_checklist_code)

# Update AdminSettings props
content = content.replace(
    "onDeleteAllChecklistsByMonth={handleDeleteAllChecklistsByMonth}",
    "onDeleteAllChecklistsByMonth={handleDeleteAllChecklistsByMonth}\n                  onDeleteChecklist={handleDeleteChecklist}"
)

with open('src/App.tsx', 'w') as f:
    f.write(content)
print("Done")
