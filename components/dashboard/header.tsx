'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { List, Table2, Calendar, Search, Plus, Filter, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ViewMode = 'list' | 'table' | 'calendar'
export type StatusFilter = 'all' | 'todo' | 'in_progress' | 'done'
export type PriorityFilter = 'all' | 'low' | 'medium' | 'high' | 'urgent'

interface HeaderProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  statusFilter: StatusFilter
  onStatusFilterChange: (filter: StatusFilter) => void
  priorityFilter: PriorityFilter
  onPriorityFilterChange: (filter: PriorityFilter) => void
  onAddTask: () => void
  onMenuClick?: () => void
}

export function Header({
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  onAddTask,
  onMenuClick
}: HeaderProps) {
  return (
    <header className="h-16 border-b border-border bg-card px-4 md:px-6 flex items-center justify-between gap-2 overflow-x-auto md:overflow-visible shrink-0 min-w-0">
      <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-min pl-1">
        {/* Mobile Menu Button */}
        {onMenuClick && (
          <Button variant="ghost" size="icon" className="md:hidden shrink-0" onClick={onMenuClick}>
            <Menu className="h-5 w-5" />
          </Button>
        )}

        {/* Search */}
        <div className="relative min-w-[150px] max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks..."
            className="pl-9 bg-background focus:bg-background/80 w-full"
          />
        </div>

        {/* Filters - hidden on mobile for cleaner look or auto-wrap */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={(v) => onStatusFilterChange(v as StatusFilter)}>
            <SelectTrigger className="w-[130px] bg-background">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={(v) => onPriorityFilterChange(v as PriorityFilter)}>
            <SelectTrigger className="w-[130px] bg-background">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* View Mode Toggle */}
        <div className="flex items-center bg-muted rounded-lg p-1">
          <button
            onClick={() => onViewModeChange('list')}
            className={cn(
              'p-2 rounded-md transition-colors',
              viewMode === 'list'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
            title="List View"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => onViewModeChange('table')}
            className={cn(
              'p-2 rounded-md transition-colors',
              viewMode === 'table'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
            title="Table View"
          >
            <Table2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onViewModeChange('calendar')}
            className={cn(
              'p-2 rounded-md transition-colors',
              viewMode === 'calendar'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
            title="Calendar View"
          >
            <Calendar className="h-4 w-4" />
          </button>
        </div>

        {/* Add Task Button */}
        <Button onClick={onAddTask} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </div>
    </header>
  )
}
