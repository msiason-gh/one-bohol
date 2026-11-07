import React from 'react';
import { MemberStatus } from '@/types/member';
import { CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { Badge } from './Badge';

export function StatusBadge({
  status,
  className = '',
}: {
  status: MemberStatus;
  className?: string;
}) {
  if (status === 'VERIFIED') {
    return (
      <Badge variant="success" className={`font-mono ${className}`}>
        <CheckCircle2 className="w-3 h-3 mr-1 text-success shrink-0" />
        VERIFIED
      </Badge>
    );
  }

  if (status === 'PENDING') {
    return (
      <Badge variant="warning" className={`font-mono ${className}`}>
        <Clock className="w-3 h-3 mr-1 text-warning shrink-0" />
        PENDING
      </Badge>
    );
  }

  return (
    <Badge variant="error" className={`font-mono ${className}`}>
      <AlertTriangle className="w-3 h-3 mr-1 text-error shrink-0" />
      INACTIVE
    </Badge>
  );
}
