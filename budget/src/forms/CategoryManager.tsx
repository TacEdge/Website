import { useState } from 'react'
import { ArrowDown, ArrowUp, Plus } from 'lucide-react'
import type { Budget, Category, ItemType } from '@/domain/types'
import { newId } from '@/data/store'
import {
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from '@/data/hooks'
import { Sheet, ConfirmDialog } from '@/components/Sheet'
import { Button, Field, SelectInput, TextInput, Toggle } from '@/components/ui'
import { useToast } from '@/components/Toast'

export function CategoryManager({
  open,
  onClose,
  budgets,
  categories,
}: {
  open: boolean
  onClose: () => void
  budgets: Budget[]
  categories: Category[]
}) {
  const toast = useToast()
  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()
  const deleteCategory = useDeleteCategory()

  const [budgetId, setBudgetId] = useState(budgets[0]?.id ?? '')
  const [itemType, setItemType] = useState<ItemType>('expense')
  const [showArchived, setShowArchived] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [editName, setEditName] = useState('')
  const [newName, setNewName] = useState('')
  const [confirmDelete, setConfirmDelete] = useState<Category | null>(null)

  const visible = categories
    .filter(
      (c) =>
        c.budgetId === budgetId &&
        c.itemType === itemType &&
        (showArchived || c.active),
    )
    .sort((a, b) => a.displayOrder - b.displayOrder)

  async function move(index: number, direction: -1 | 1) {
    const a = visible[index]
    const b = visible[index + direction]
    if (!a || !b) return
    try {
      await Promise.all([
        updateCategory.mutateAsync({ id: a.id, patch: { displayOrder: b.displayOrder } }),
        updateCategory.mutateAsync({ id: b.id, patch: { displayOrder: a.displayOrder } }),
      ])
    } catch {
      toast('Unable to reorder categories.', 'error')
    }
  }

  return (
    <>
      <Sheet open={open} onClose={onClose} title="Manage categories" wide>
        <div className="flex flex-col gap-4 pb-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Budget" htmlFor="cat-budget">
              <SelectInput
                id="cat-budget"
                value={budgetId}
                onChange={(e) => setBudgetId(e.target.value)}
              >
                {budgets.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Type" htmlFor="cat-type">
              <SelectInput
                id="cat-type"
                value={itemType}
                onChange={(e) => setItemType(e.target.value as ItemType)}
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </SelectInput>
            </Field>
          </div>

          <Toggle
            label="Show archived categories"
            checked={showArchived}
            onChange={setShowArchived}
          />

          <ul className="flex flex-col divide-y divide-line rounded-lg border border-line bg-card">
            {visible.length === 0 && (
              <li className="px-4 py-5 text-center text-[13px] font-light text-moss">
                No categories here yet.
              </li>
            )}
            {visible.map((category, index) => (
              <li key={category.id} className="flex items-center gap-2 px-3 py-2">
                <span className="flex">
                  <button
                    aria-label={`Move ${category.name} up`}
                    disabled={index === 0}
                    onClick={() => move(index, -1)}
                    className="flex size-9 items-center justify-center text-moss disabled:opacity-30"
                  >
                    <ArrowUp className="size-4" />
                  </button>
                  <button
                    aria-label={`Move ${category.name} down`}
                    disabled={index === visible.length - 1}
                    onClick={() => move(index, 1)}
                    className="flex size-9 items-center justify-center text-moss disabled:opacity-30"
                  >
                    <ArrowDown className="size-4" />
                  </button>
                </span>
                <span className="min-w-0 flex-1 truncate text-[14px] font-normal text-ink">
                  {category.name}
                  {!category.active && (
                    <span className="text-[12px] font-light text-moss"> · Archived</span>
                  )}
                </span>
                <Button
                  variant="quiet"
                  className="min-h-9 px-2 text-[13px]"
                  onClick={() => {
                    setEditing(category)
                    setEditName(category.name)
                  }}
                >
                  Rename
                </Button>
                <Button
                  variant="quiet"
                  className="min-h-9 px-2 text-[13px]"
                  onClick={async () => {
                    try {
                      await updateCategory.mutateAsync({
                        id: category.id,
                        patch: { active: !category.active },
                      })
                    } catch {
                      toast('Unable to save this change.', 'error')
                    }
                  }}
                >
                  {category.active ? 'Archive' : 'Restore'}
                </Button>
                <Button
                  variant="quiet"
                  className="min-h-9 px-2 text-[13px] text-brick"
                  onClick={() => setConfirmDelete(category)}
                >
                  Delete
                </Button>
              </li>
            ))}
          </ul>

          <div className="flex gap-2.5">
            <TextInput
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="New category name"
              aria-label="New category name"
            />
            <Button
              variant="primary"
              disabled={newName.trim() === ''}
              onClick={async () => {
                try {
                  await createCategory.mutateAsync({
                    id: newId(),
                    budgetId,
                    name: newName.trim(),
                    itemType,
                    icon: null,
                    displayOrder:
                      Math.max(0, ...visible.map((c) => c.displayOrder)) + 1,
                    active: true,
                    isFinancing: false,
                  })
                  setNewName('')
                  toast('Category added')
                } catch {
                  toast('Unable to add this category.', 'error')
                }
              }}
            >
              <Plus aria-hidden className="size-4" /> Add
            </Button>
          </div>
        </div>
      </Sheet>

      {/* Rename */}
      <Sheet open={editing != null} onClose={() => setEditing(null)} title="Rename category">
        <div className="flex flex-col gap-4 pb-4">
          <Field label="Name" htmlFor="cat-rename">
            <TextInput
              id="cat-rename"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
          </Field>
          <Button
            variant="primary"
            disabled={editName.trim() === ''}
            onClick={async () => {
              if (!editing) return
              try {
                await updateCategory.mutateAsync({
                  id: editing.id,
                  patch: { name: editName.trim() },
                })
                setEditing(null)
                toast('Category renamed')
              } catch {
                toast('Unable to rename this category.', 'error')
              }
            }}
          >
            Save
          </Button>
        </div>
      </Sheet>

      <ConfirmDialog
        open={confirmDelete != null}
        onClose={() => setConfirmDelete(null)}
        onConfirm={async () => {
          if (!confirmDelete) return
          try {
            await deleteCategory.mutateAsync(confirmDelete.id)
            toast('Category deleted — its items are now uncategorised')
          } catch {
            toast('Unable to delete this category.', 'error')
          }
        }}
        title="Delete this category?"
        body="Items using it will become uncategorised. If you want to keep history tidy, archive it instead."
        confirmLabel="Delete"
        destructive
      />
    </>
  )
}
