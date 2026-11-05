import { TBreadcrumbItem } from '../breadcrumb-item';

const formatFallbackLabel = (segment: string): string =>
  segment
  .split('-')
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join(' ');

export const getRouteSegmentLabels = (customRouteSegmentLabels?: Record<string, string>): Record<string, string> => {
  const routeSegmentLabels: Record<string, string> = {
    'register-user': 'Register User'
  };
  if (customRouteSegmentLabels) {
    return {
      ...routeSegmentLabels,
      ...customRouteSegmentLabels
    }
  }
  return routeSegmentLabels;
};

type BuildBreadcrumbParams = {
  pathname: string;
  homeSegment: string;
  blockedPaths: Array<string>;
  routeSegmentLabels: Record<string, string>;
}

export const buildBreadcrumbs = ({
  pathname,
  homeSegment,
  blockedPaths,
  routeSegmentLabels,
  }: BuildBreadcrumbParams) => {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) {
    return [];
  }

  if (segments.length === 1 && segments[0] === homeSegment) {
    return [];
  }

  const items: Array<Omit<TBreadcrumbItem, 'onItemClick'>> = [];

  const needsHomeRoot = segments[0] !== homeSegment;

  if (needsHomeRoot) {
    items.push({
      href: `/${homeSegment}`,
      label: homeSegment,
      clickable: true,
      isCurrent: false,
    })
  }

  segments.forEach((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/');
    const label = routeSegmentLabels[segment] ?? formatFallbackLabel(segment);
    const isCurrent = index === segments.length - 1;
    const clickable = !blockedPaths.includes(segment);

    if (segment === 'home' && !isCurrent) {
      items.push({ label, href, clickable, isCurrent: false });
    } else {
      items.push({ label, href, clickable, isCurrent });
    }
  });
  return items;
};