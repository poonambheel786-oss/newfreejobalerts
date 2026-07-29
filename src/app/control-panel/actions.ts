'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function login(state: any, formData: FormData) {
  const username = formData.get('username')
  const password = formData.get('password')

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const cookieStore = await cookies()
    cookieStore.set('admin_session_secure', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/'
    })
    return { success: true }
  }

  return { success: false, error: 'Invalid credentials' }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_session_secure')
  cookieStore.delete('admin_session')
  redirect('/control-panel/login')
}

export async function createJob(state: any, formData: FormData) {
  try {
    const id = formData.get('id') as string | null
    const title = formData.get('title') as string
    const departmentName = formData.get('department') as string
    const advtNumber = formData.get('advtNumber') as string
    const vacancy = parseInt(formData.get('vacancy') as string) || 0
    const qualificationName = formData.get('qualification') as string
    const eligibility = formData.get('eligibility') as string
    const ageLimit = formData.get('ageLimit') as string
    const salary = formData.get('salary') as string
    const selectionProcess = formData.get('selectionProcess') as string
    const applicationFees = formData.get('applicationFees') as string
    const startDate = formData.get('startDate') as string
    const endDate = formData.get('endDate') as string
    const examDate = formData.get('examDate') as string
    const customDatesJson = formData.get('customDatesJson') as string || "[]"
    const customLinksJson = formData.get('customLinksJson') as string || "[]"
    const faqSchemaJson = formData.get('faqSchemaJson') as string || "[]"
    
    let customDates = [];
    let customLinks = [];
    try {
      customDates = JSON.parse(customDatesJson);
    } catch(e) {}
    try {
      customLinks = JSON.parse(customLinksJson);
    } catch(e) {}

    let faqSchema = [];
    try {
      faqSchema = JSON.parse(faqSchemaJson);
    } catch(e) {}

    const pdfUrl = formData.get('pdfUrl') as string
    const applyLink = formData.get('applyLink') as string
    const officialWebsite = formData.get('officialWebsite') as string
    const stateName = formData.get('state') as string || "All India"
    const categoryName = formData.get('category') as string
    const postType = (formData.get('postType') as string) || "Latest Notifications"
    const status = (formData.get('status') as string) || "Published"

    const overview = formData.get('overview') as string
    const vacancyDetails = formData.get('vacancyDetails') as string
    const howToApply = formData.get('howToApply') as string

    // SEO Parameters
    const customMetaTitle = formData.get('metaTitle') as string
    const customMetaDescription = formData.get('metaDescription') as string
    const searchTags = formData.get('searchTags') as string

    const isJob = postType === "Latest Notifications";
    const finalDepartmentName = isJob ? departmentName : "General Board";
    const finalQualificationName = isJob ? qualificationName : "General Eligibility";

    if (!title || !finalDepartmentName || !finalQualificationName || !categoryName) {
      return { success: false, error: 'Please fill in all required fields marked with *.' }
    }

    // Generate unique slug (only for new jobs, if editing, we keep the original slug or regenerate)
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Math.floor(Math.random() * 1000)

    // Find or Create Department
    const deptSlug = finalDepartmentName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const department = await prisma.department.upsert({
      where: { slug: deptSlug },
      update: {},
      create: { name: finalDepartmentName, slug: deptSlug }
    })

    // Find or Create Qualification
    const qualSlug = finalQualificationName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const qualification = await prisma.qualification.upsert({
      where: { slug: qualSlug },
      update: {},
      create: { name: finalQualificationName, slug: qualSlug }
    })

    // Find State
    const stateSlug = stateName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const dbState = await prisma.state.findUnique({
      where: { slug: stateSlug }
    })

    // Find Category
    const catSlug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const category = await prisma.category.findUnique({
      where: { slug: catSlug }
    })

    if (!category) {
      return { success: false, error: 'Selected category does not exist in database.' }
    }

    let defaultMetaTitle = `${title} - Vacancy Eligibility Apply Details`;
    let defaultMetaDescription = `Apply for ${vacancy} posts in ${finalDepartmentName}. Qualification required: ${finalQualificationName}. Last date to apply: ${endDate || 'N/A'}.`;

    if (postType === "Admit Cards") {
      defaultMetaTitle = `${title} - Download Admit Card / Hall Ticket`;
      defaultMetaDescription = `Download Admit Card / Hall Ticket for ${title}. Check exam dates, download instructions, and direct link.`;
    } else if (postType === "Results") {
      defaultMetaTitle = `${title} - Check Score Card & Merit List`;
      defaultMetaDescription = `Check exam results, merit list, cut off marks, and score card details for ${title}. Direct link to download.`;
    }

    const jobData = {
      title,
      status,
      overview,
      vacancyDetails,
      howToApply,
      departmentId: department.id,
      stateId: dbState?.id || null,
      qualificationId: qualification.id,
      categoryId: category.id,
      postType,
      vacancy,
      eligibility,
      ageLimit,
      salary,
      selectionProcess,
      applicationFees,
      importantDates: {
        start: startDate,
        end: endDate,
        examDate: examDate,
        customDates,
        customLinks
      },
      pdfUrl,
      applyLink,
      officialWebsite,
      advtNumber: advtNumber || null,
      metaTitle: customMetaTitle || defaultMetaTitle,
      metaDescription: customMetaDescription || defaultMetaDescription,
      searchTags: searchTags || null,
      faqSchema
    }

    if (id) {
      // Update existing job
      const updated = await prisma.job.update({
        where: { id },
        data: jobData
      })
      
      // Defer revalidation to background
      Promise.resolve().then(() => {
        try {
          revalidatePath("/", "layout")
        } catch (e) {
          console.error("Background revalidation failed:", e)
        }
      })
    } else {
      // Save new Job
      await prisma.job.create({
        data: {
          ...jobData,
          slug
        }
      })

      // Defer revalidation to background
      Promise.resolve().then(() => {
        try {
          revalidatePath("/", "layout")
        } catch (e) {
          console.error("Background revalidation failed:", e)
        }
      })
    }

    return { success: true }
  } catch (e: any) {
    console.error(e)
    return { success: false, error: e.message || 'An unexpected error occurred while saving the notification.' }
  }
}
