import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Shield } from 'lucide-react';

const SecurityAuditViewer = () => {
  const { data: auditLogs, isLoading } = useQuery({
    queryKey: ['admin-security-audit'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('security_audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      if (error) throw error;
      return data;
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security Audit Log
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Table</TableHead>
                  <TableHead>Operation</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs?.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-sm">
                      {log.created_at ? format(new Date(log.created_at), 'PPpp') : 'N/A'}
                    </TableCell>
                    <TableCell className="font-medium">{log.table_name}</TableCell>
                    <TableCell>
                      <Badge variant={
                        log.operation === 'INSERT' ? 'default' :
                        log.operation === 'UPDATE' ? 'secondary' :
                        log.operation === 'DELETE' ? 'destructive' : 'outline'
                      }>
                        {log.operation}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{log.user_id || 'N/A'}</TableCell>
                    <TableCell>{log.ip_address ? String(log.ip_address) : 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SecurityAuditViewer;
