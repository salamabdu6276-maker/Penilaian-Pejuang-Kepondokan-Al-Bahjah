import re

with open('src/components/ChecklistFormInput.tsx', 'r') as f:
    content = f.read()

# We need to add the auto-save functionality
# Look for the useEffect where it loads data
target_effect = """  // Initialize or load existing checklist when pejuang, month, year, or week changes
  useEffect(() => {
    if (!selectedPejuangId) {
      if (pejuangList.length > 0) {
        setSelectedPejuangId(pejuangList[0].id);
      }
      return;
    }

    const existing = existingSubmissions.find(s => 
      s.pejuangId === selectedPejuangId &&
      s.bulan === selectedMonth &&
      s.tahun === selectedYear &&
      s.pekan === selectedWeek
    );

    if (existing) {
      setTasks(existing.tasks);
    } else {
      // Find pejuang specific default tasks if any, otherwise use general
      const pejuang = pejuangList.find(p => p.id === selectedPejuangId);
      let initialTasks: TaskRecord[] = [];
      
      DEFAULT_CHECKLIST_TASKS.forEach(dt => {
        initialTasks.push({
          id: dt.id,
          waktu: dt.waktu,
          uraian: dt.uraian,
          kategori: dt.kategori,
          catatan: "",
          realisasiChecks: {} // empty object for dynamic dates
        });
      });
      setTasks(initialTasks);
    }
  }, [selectedPejuangId, selectedMonth, selectedYear, selectedWeek, existingSubmissions, pejuangList]);"""

new_effect = """  // Initialize or load existing checklist when pejuang, month, year, or week changes
  useEffect(() => {
    if (!selectedPejuangId) {
      if (pejuangList.length > 0) {
        setSelectedPejuangId(pejuangList[0].id);
      }
      return;
    }

    const existing = existingSubmissions.find(s => 
      s.pejuangId === selectedPejuangId &&
      s.bulan === selectedMonth &&
      s.tahun === selectedYear &&
      s.pekan === selectedWeek
    );

    if (existing) {
      setTasks(existing.tasks);
    } else {
      const draftKey = `draft_checklist_${selectedPejuangId}_${selectedYear}_${selectedMonth}_${selectedWeek}`;
      const draftData = localStorage.getItem(draftKey);
      
      if (draftData) {
        try {
          setTasks(JSON.parse(draftData));
          return;
        } catch (e) {
          console.error("Failed to parse draft", e);
        }
      }

      // Find pejuang specific default tasks if any, otherwise use general
      const pejuang = pejuangList.find(p => p.id === selectedPejuangId);
      let initialTasks: TaskRecord[] = [];
      
      DEFAULT_CHECKLIST_TASKS.forEach(dt => {
        initialTasks.push({
          id: dt.id,
          waktu: dt.waktu,
          uraian: dt.uraian,
          kategori: dt.kategori,
          catatan: "",
          realisasiChecks: {} // empty object for dynamic dates
        });
      });
      setTasks(initialTasks);
    }
  }, [selectedPejuangId, selectedMonth, selectedYear, selectedWeek, existingSubmissions, pejuangList]);

  // Auto-save draft to localStorage whenever tasks change
  useEffect(() => {
    if (!selectedPejuangId || tasks.length === 0) return;
    
    const existing = existingSubmissions.find(s => 
      s.pejuangId === selectedPejuangId &&
      s.bulan === selectedMonth &&
      s.tahun === selectedYear &&
      s.pekan === selectedWeek
    );
    
    // Only save draft if it's not a previously submitted exact match (avoids unnecessary overwrites)
    if (!existing || JSON.stringify(existing.tasks) !== JSON.stringify(tasks)) {
      const draftKey = `draft_checklist_${selectedPejuangId}_${selectedYear}_${selectedMonth}_${selectedWeek}`;
      localStorage.setItem(draftKey, JSON.stringify(tasks));
    }
  }, [tasks, selectedPejuangId, selectedMonth, selectedYear, selectedWeek, existingSubmissions]);"""

content = content.replace(target_effect, new_effect)

# When form is submitted successfully, we should clear the draft
submit_handler_target = """    onSaveSubmission(submission);
    
    // Force a re-render or notification (in a real app, maybe a toast)
    alert("Data Checklist Berhasil Disimpan!");
  };"""

submit_handler_new = """    onSaveSubmission(submission);
    
    // Clear draft on successful submit
    const draftKey = `draft_checklist_${selectedPejuangId}_${selectedYear}_${selectedMonth}_${selectedWeek}`;
    localStorage.removeItem(draftKey);
    
    // Force a re-render or notification (in a real app, maybe a toast)
    alert("Data Checklist Berhasil Disimpan!");
  };"""

content = content.replace(submit_handler_target, submit_handler_new)

with open('src/components/ChecklistFormInput.tsx', 'w') as f:
    f.write(content)
