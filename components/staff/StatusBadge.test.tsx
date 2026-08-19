import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBadge } from './StatusBadge';

describe('StatusBadge', () => {
  it('renders "กำลังกรอก" label for filling status', () => {
    render(<StatusBadge status="filling" />);
    expect(screen.getByRole('status', { name: 'กำลังกรอก' })).toBeInTheDocument();
  });

  it('renders "ส่งแล้ว" label for submitted status', () => {
    render(<StatusBadge status="submitted" />);
    expect(screen.getByRole('status', { name: 'ส่งแล้ว' })).toBeInTheDocument();
  });

  it('renders "ไม่ใช้งาน" label for inactive status', () => {
    render(<StatusBadge status="inactive" />);
    expect(screen.getByRole('status', { name: 'ไม่ใช้งาน' })).toBeInTheDocument();
  });

  it('applies animate-pulse class only for filling status', () => {
    const { container: fillingContainer } = render(<StatusBadge status="filling" />);
    const { container: submittedContainer } = render(<StatusBadge status="submitted" />);

    expect(fillingContainer.querySelector('.animate-pulse')).not.toBeNull();
    expect(submittedContainer.querySelector('.animate-pulse')).toBeNull();
  });

  it('applies blue styling for filling status', () => {
    const { container } = render(<StatusBadge status="filling" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain('blue');
  });

  it('applies green styling for submitted status', () => {
    const { container } = render(<StatusBadge status="submitted" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain('green');
  });

  it('applies slate styling for inactive status', () => {
    const { container } = render(<StatusBadge status="inactive" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain('slate');
  });
});
