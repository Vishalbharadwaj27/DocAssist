// gemma.js

import { getPatientById, patients } from "./mockData.js"; // Adjust path if necessary

export const getGemmaResponse = async (prompt, patientId) => {
  // ... (Your API logic here) ...
  // In a real browser environment without a build tool like Vite,
  // import.meta.env.VITE_GEMMA_API_KEY would not work.
  // You would typically define an API key directly or load it from a global variable.
  // For this conversion, we keep it as is, assuming a similar module environment.
  const apiKey = import.meta.env.VITE_GEMMA_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  // Default context prompt if no patient ID is provided
  let finalPrompt = `
    You are a medical assistant. Provide a concise medical summary based on the following patient information, without any introductory phrases or extra formatting.
    Doctor's Question: ${prompt}
  `;

  const lowerPrompt = prompt.toLowerCase();

  // When no patientId, handle aggregate queries (diabetes, critical, etc.)
  if (!patientId) {
    if (
      lowerPrompt.includes("diabetes") ||
      lowerPrompt.includes("critical") ||
      lowerPrompt.includes("warning") ||
      lowerPrompt.includes("stable")
    ) {
      if (lowerPrompt.includes("diabetes")) {
        const diabetesCount = patients.filter(patient =>
          patient.conditions.some(condition => condition.name.toLowerCase().includes("diabetes"))
        ).length;
        return `There are ${diabetesCount} patients with diabetes.`;
      } else if (lowerPrompt.includes("critical")) {
        const criticalCount = patients.filter(patient => patient.status === "critical").length;
        return `There are ${criticalCount} patients in critical condition.`;
      } else if (lowerPrompt.includes("warning")) {
        const warningCount = patients.filter(patient => patient.status === "warning").length;
        return `There are ${warningCount} patients in the warning category.`;
      } else if (lowerPrompt.includes("stable")) {
        const stableCount = patients.filter(patient => patient.status === "stable").length;
        return `There are ${stableCount} patients in stable condition.`;
      }
    } else {
      return `For specific patient questions, please go to the patient page.`;
    }
  } else {
    // Check if patientId is provided and the prompt includes the patient's first name
    const patient = getPatientById(patientId);
    if (patient && prompt.toLowerCase().includes(patient.firstName.toLowerCase())) {
      // Compute age from dateOfBirth
      const age = patient.dateOfBirth
        ? new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()
        : "Unknown";

      // Build a detailed patient info string
      const patientInfo = `
Patient Information:
  Name: ${patient.firstName} ${patient.lastName}
  Age: ${age}
  Gender: ${patient.gender}
  Medical Record Number (MRN): ${patient.mrn}
  Primary Doctor: ${patient.primaryDoctor}
  Conditions: ${patient.conditions.map(c => `${c.name} (${c.status}, ${c.severity})`).join(", ")}
  Medications: ${patient.medications.map(m => `${m.name} (${m.dosage}, ${m.frequency})`).join(", ")}
  Blood Pressure: ${patient.vitalSigns?.bloodPressure || "Not available"}
  Last Visit: ${patient.lastVisit}
  Recent Lab Results:
${patient.labResults.map(lr => `${lr.name}: ${lr.result} (Status: ${lr.status})`).join("\n")}
      `;
      finalPrompt = `Doctor's Question: ${prompt}\n\n${patientInfo}`;
    } else if (patient && !prompt.toLowerCase().includes(patient.firstName.toLowerCase())) {
      return `Please ask patient-specific questions in the patient page.`;
    }
  }

  try {
    console.log("Sending request to Gemini API with prompt:", finalPrompt);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: finalPrompt }] }],
      }),
    });

    const data = await response.json();
    console.log("Gemini API Response:", data);

    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to fetch AI response");
    }

    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error: Could not process the request.";
  }
};