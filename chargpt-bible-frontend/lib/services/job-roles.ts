import { directus } from '@/lib/directus';
import { readItems } from '@directus/sdk';
import type { JobRole } from '@/types/JobRole';

/**
 * Fetch all job roles from Directus
 * Used for filter sidebar
 */
export async function getJobRoles(): Promise<JobRole[]> {
  try {
    const jobRoles = await directus.request(
      readItems('job_roles', {
        fields: ['id', 'name', 'slug', 'description', 'sort'],
        sort: ['sort', 'name'],
      })
    );

    return jobRoles as unknown as JobRole[];
  } catch (error) {
    console.error('Error fetching job roles:', error);
    return [];
  }
}

