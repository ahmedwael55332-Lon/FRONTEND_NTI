import { Pipe, PipeTransform } from '@angular/core';
import { LanguageService } from '../core/services/language.service';

const translations: Record<string, string> = {
  'Home': 'الرئيسية',
  'About': 'عن المنصة',
  'Contact': 'تواصل معنا',
  'Login': 'تسجيل الدخول',
  'Register': 'إنشاء حساب',
  'Logout': 'تسجيل الخروج',
  'Profile': 'الملف الشخصي',
  'Dashboard': 'لوحة التحكم',
  'Users': 'المستخدمون',
  'Donors': 'المتبرعون',
  'Blood Units': 'وحدات الدم',
  'Blood Requests': 'طلبات الدم',
  'Notifications': 'الإشعارات',
  'Medical Check': 'الفحص الطبي',
  'Emergency Alerts': 'تنبيهات الطوارئ',
  'My Requests': 'طلباتي',
  'Create Request': 'إنشاء طلب',
  'Compatible Donors': 'المتبرعون المتوافقون',
  'Admin Portal': 'لوحة الإدارة',
  'System Oversight': 'إدارة ومتابعة النظام',
  'Account Settings': 'إعدادات الحساب',
  'Smart Blood Bank Management System': 'نظام إدارة بنك الدم الذكي',
  'A secure platform connecting blood donors, requests, and inventory efficiently. Ensuring life-saving resources are always available when needed most.': 'منصة آمنة تربط المتبرعين وطلبات الدم والمخزون بكفاءة، لضمان توفر الموارد المنقذة للحياة وقت الحاجة.',
  'Become a Donor': 'كن متبرعًا',
  'Request Blood': 'طلب دم',
  'Go to Dashboard': 'الذهاب إلى لوحة التحكم',
  'How It Works': 'كيف تعمل المنصة',
  'Create Your Profile': 'أنشئ ملفك الشخصي',
  'Manage Blood Needs': 'إدارة احتياجات الدم',
  'Find Compatible Donors': 'العثور على متبرعين متوافقين',
  'Respond to Emergencies': 'الاستجابة للطوارئ',
  'One calm, connected blood bank workflow.': 'منظومة واحدة ومنظمة لإدارة بنك الدم.',
  'Secure': 'آمن',
  'Connected': 'متصل',
  'Focused': 'متخصص',
  'Authenticated access': 'دخول موثّق وآمن',
  'Real-time emergency alerts': 'تنبيهات طوارئ فورية',
  'Blood type + Rh matching': 'مطابقة فصيلة الدم وRh',
  'Good morning': 'صباح الخير',
  'Add Blood Unit': 'إضافة وحدة دم',
  'Available Blood Units': 'وحدات الدم المتاحة',
  'Pending Requests': 'الطلبات المعلقة',
  'Completed Requests': 'الطلبات المكتملة',
  'Emergency Requests': 'طلبات الطوارئ',
  'Completion Rate': 'نسبة الإكمال',
  'Request Status Overview': 'نظرة عامة على حالة الطلبات',
  'Quick Actions': 'إجراءات سريعة',
  'Review Requests': 'مراجعة الطلبات',
  'Manage Donors': 'إدارة المتبرعين',
  'Recent Blood Requests': 'أحدث طلبات الدم',
  'View all': 'عرض الكل',
  'Live': 'مباشر',
  'Loading dashboard...': 'جارٍ تحميل لوحة التحكم...',
  'My Profile': 'ملفي الشخصي',
  'Save Changes': 'حفظ التغييرات',
  'Saving...': 'جارٍ الحفظ...',
  'Account': 'الحساب',
  'Switch to Arabic': 'التبديل إلى العربية',
  'Switch to English': 'التبديل إلى الإنجليزية'
};

@Pipe({ name: 'translate', pure: false })
export class TranslatePipe implements PipeTransform {
  constructor(private languageService: LanguageService) {}

  transform(value: string | null | undefined): string {
    if (!value) return '';
    return this.languageService.isArabic ? (translations[value] || value) : value;
  }
}
