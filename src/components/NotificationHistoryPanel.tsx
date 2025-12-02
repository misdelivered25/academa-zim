import { useState, useMemo } from 'react';
import { format, startOfDay, endOfDay, subDays } from 'date-fns';
import { NotificationHistoryItem } from '@/hooks/useNotificationHistory';
import { NotificationType, useNotificationSounds } from '@/hooks/useNotificationSounds';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  History,
  Play,
  X,
  Filter,
  CalendarDays,
  Trash2,
  CheckCheck,
  Bell,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotificationHistoryPanelProps {
  history: NotificationHistoryItem[];
  onDismiss: (id: string) => void;
  onDismissAll: () => void;
  onClear: () => void;
  getFilteredHistory: (filters: {
    types?: Array<'info' | 'warning' | 'error' | 'success'>;
    startDate?: Date;
    endDate?: Date;
    showDismissed?: boolean;
  }) => NotificationHistoryItem[];
}

const typeIcons = {
  info: Info,
  warning: AlertTriangle,
  error: AlertCircle,
  success: CheckCircle,
};

const typeColors = {
  info: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  warning: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  error: 'bg-destructive/10 text-destructive border-destructive/20',
  success: 'bg-green-500/10 text-green-500 border-green-500/20',
};

export const NotificationHistoryPanel = ({
  history,
  onDismiss,
  onDismissAll,
  onClear,
  getFilteredHistory,
}: NotificationHistoryPanelProps) => {
  const { testSound } = useNotificationSounds();
  
  const [selectedTypes, setSelectedTypes] = useState<Array<'info' | 'warning' | 'error' | 'success'>>([]);
  const [dateRange, setDateRange] = useState<{ start?: Date; end?: Date }>({});
  const [showDismissed, setShowDismissed] = useState(true);

  const filteredHistory = useMemo(() => {
    return getFilteredHistory({
      types: selectedTypes.length > 0 ? selectedTypes : undefined,
      startDate: dateRange.start ? startOfDay(dateRange.start) : undefined,
      endDate: dateRange.end ? endOfDay(dateRange.end) : undefined,
      showDismissed,
    });
  }, [getFilteredHistory, selectedTypes, dateRange, showDismissed]);

  const handleTypeToggle = (type: 'info' | 'warning' | 'error' | 'success') => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleReplay = (notification: NotificationHistoryItem) => {
    if (notification.soundType) {
      testSound(notification.soundType);
    }
  };

  const handleQuickFilter = (days: number) => {
    const end = new Date();
    const start = subDays(end, days);
    setDateRange({ start, end });
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setDateRange({});
    setShowDismissed(true);
  };

  const hasActiveFilters = selectedTypes.length > 0 || dateRange.start || dateRange.end || !showDismissed;

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5" />
            <CardTitle>Notification History</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismissAll}
              disabled={filteredHistory.filter((n) => !n.dismissed).length === 0}
            >
              <CheckCheck className="h-4 w-4 mr-1" />
              Dismiss All
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              disabled={history.length === 0}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Clear
            </Button>
          </div>
        </div>
        <CardDescription>
          Last {history.length} notifications • {filteredHistory.length} shown
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Type Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <Filter className="h-3 w-3 mr-1" />
                Type
                {selectedTypes.length > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1">
                    {selectedTypes.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-3" align="start">
              <div className="space-y-2">
                {(['info', 'warning', 'error', 'success'] as const).map((type) => {
                  const Icon = typeIcons[type];
                  return (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`type-${type}`}
                        checked={selectedTypes.includes(type)}
                        onCheckedChange={() => handleTypeToggle(type)}
                      />
                      <Label
                        htmlFor={`type-${type}`}
                        className="flex items-center gap-2 cursor-pointer capitalize"
                      >
                        <Icon className="h-3 w-3" />
                        {type}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>

          {/* Date Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <CalendarDays className="h-3 w-3 mr-1" />
                Date
                {(dateRange.start || dateRange.end) && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1">
                    1
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3" align="start">
              <div className="space-y-3">
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickFilter(1)}
                    className="text-xs"
                  >
                    Today
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickFilter(7)}
                    className="text-xs"
                  >
                    7 days
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickFilter(30)}
                    className="text-xs"
                  >
                    30 days
                  </Button>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label className="text-xs">Start Date</Label>
                  <Calendar
                    mode="single"
                    selected={dateRange.start}
                    onSelect={(date) => setDateRange((prev) => ({ ...prev, start: date }))}
                    className="rounded-md border p-0"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">End Date</Label>
                  <Calendar
                    mode="single"
                    selected={dateRange.end}
                    onSelect={(date) => setDateRange((prev) => ({ ...prev, end: date }))}
                    className="rounded-md border p-0"
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Show Dismissed */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="show-dismissed"
              checked={showDismissed}
              onCheckedChange={(checked) => setShowDismissed(!!checked)}
            />
            <Label htmlFor="show-dismissed" className="text-sm cursor-pointer">
              Show dismissed
            </Label>
          </div>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8">
              <X className="h-3 w-3 mr-1" />
              Clear filters
            </Button>
          )}
        </div>

        <Separator />

        {/* Notification List */}
        <ScrollArea className="h-[300px] pr-4">
          {filteredHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Bell className="h-8 w-8 mb-2 opacity-50" />
              <p className="text-sm">No notifications found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredHistory.map((notification) => {
                const Icon = typeIcons[notification.type];
                return (
                  <div
                    key={notification.id}
                    className={cn(
                      'flex items-start gap-3 p-3 rounded-lg border transition-opacity',
                      typeColors[notification.type],
                      notification.dismissed && 'opacity-50'
                    )}
                  >
                    <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate">{notification.title}</p>
                        {notification.dismissed && (
                          <Badge variant="outline" className="text-xs h-5">
                            Dismissed
                          </Badge>
                        )}
                      </div>
                      {notification.description && (
                        <p className="text-xs opacity-80 mt-0.5 line-clamp-2">
                          {notification.description}
                        </p>
                      )}
                      <p className="text-xs opacity-60 mt-1">
                        {format(notification.timestamp, 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {notification.soundType && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReplay(notification)}
                          className="h-7 w-7 p-0"
                          title="Replay sound"
                        >
                          <Play className="h-3 w-3" />
                        </Button>
                      )}
                      {!notification.dismissed && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDismiss(notification.id)}
                          className="h-7 w-7 p-0"
                          title="Dismiss"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
