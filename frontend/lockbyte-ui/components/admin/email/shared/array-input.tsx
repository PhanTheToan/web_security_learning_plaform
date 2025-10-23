"use client"

import React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { XIcon, PlusIcon } from "lucide-react"

interface ArrayInputProps {
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  label?: string
}

export function ArrayInput({
  value = [],
  onChange,
  placeholder,
  label,
}: ArrayInputProps) {
  const handleAdd = () => {
    onChange([...value, ""])
  }

  const handleRemove = (index: number) => {
    const newValue = [...value]
    newValue.splice(index, 1)
    onChange(newValue)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newValue = [...value]
    newValue[index] = e.target.value
    onChange(newValue)
  }

  const inputClassName = "bg-transparent border-[#ffffff]/20 focus:border-[#9747ff] focus:ring-[#9747ff] text-white"

  return (
    <div className="space-y-2">
      {value.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            value={item}
            onChange={(e) => handleChange(e, index)}
            placeholder={placeholder}
            className={inputClassName}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => handleRemove(index)}
            className="text-gray-400 hover:text-red-500"
          >
            <XIcon className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleAdd}
        className="bg-transparent border-[#9747ff]/50 text-white hover:bg-[#9747ff]/20 hover:text-white"
      >
        <PlusIcon className="h-4 w-4 mr-2" />
        Add {label || "Item"}
      </Button>
    </div>
  )
}
