"use client";

import { useEffect, useState } from "react";
import { Checkbox } from "@/app/components/ui/checkbox"; // Assuming you have a Shadcn Checkbox component
import { Label } from "@/app/components/ui/label"; // Assuming you have a Shadcn Label component

interface Model {
  id: string;
  name: string;
}

interface ModelFilterProps {
  onSelectedModelsChange: (selectedModels: string[]) => void;
  selectedModels: string[];
}

const ModelFilter: React.FC<ModelFilterProps> = ({ onSelectedModelsChange, selectedModels }) => {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch("/api/chat/models");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result: { models: Model[] } = await response.json();
        const sortedModels = result.models.sort((a, b) => a.name.localeCompare(b.name));
        setModels(sortedModels);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  const handleCheckboxChange = (modelId: string, isChecked: boolean) => {
    if (isChecked) {
      onSelectedModelsChange([...selectedModels, modelId]);
    } else {
      onSelectedModelsChange(selectedModels.filter((id) => id !== modelId));
    }
  };

  if (loading) {
    return <div className="p-4 text-gray-400">Loading models...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-400">Error: {error}</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-semibold text-gray-200">Filter by Model</h3>
      <div className="space-y-2">
        {models.map((model) => (
          <div key={model.id} className="flex items-center space-x-2">
            <Checkbox
              id={`model-${model.id}`}
              checked={selectedModels.includes(model.id)}
              onCheckedChange={(checked: boolean) =>
                handleCheckboxChange(model.id, checked)
              }
            />
            <Label htmlFor={`model-${model.id}`} className="text-gray-300 py-1">
              {model.name}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModelFilter;