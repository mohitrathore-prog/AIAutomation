export interface QACheckResult {
  passed: boolean;
  score: number;
  retryCount: number;
  checks: Array<{
    name: string;
    passed: boolean;
    score: number;
    feedback: string;
  }>;
  overallFeedback: string;
  actionTaken: 'published' | 'scheduled' | 'sent_to_review' | 'retried';
}

export class QualityControlService {
  /**
   * Run comprehensive QC checks on generated content data.
   * If checks fail, simulates a retry loop, then routes to a review queue if it fails again.
   */
  async validate(contentItem: {
    id: string;
    title: string;
    contentType: string;
    data: any;
  }, retryAttempt = 0): Promise<QACheckResult> {
    console.log(`[QualityControlService] Running checks on: "${contentItem.title}" (Attempt ${retryAttempt + 1})`);

    const checks = [
      {
        name: 'Grammar & Tone Compliance',
        ...this.evaluateMetric(92, 'Sentence structures align with brand voice guidelines. No spelling errors found.')
      },
      {
        name: 'Fact & Logical Consistency',
        ...this.evaluateMetric(88, 'Information aligns with vetted source materials and background references.')
      },
      {
        name: 'Copyright and Plagiarism Scan',
        // Let's generate a low score occasionally to trigger the retry/review pipeline demo
        ...this.evaluateMetric(
          contentItem.title.toLowerCase().includes('copyright-fail') ? 65 : 95,
          contentItem.title.toLowerCase().includes('copyright-fail')
            ? 'Warning: Content matches catalog records in background music.'
            : 'No matching copyrighted content detected in assets.'
        )
      },
      {
        name: 'Subtitle Alignment Check',
        ...this.evaluateMetric(96, 'Voice track timings match subtitle cues accurately.')
      },
      {
        name: 'SEO Performance Rating',
        ...this.evaluateMetric(90, 'Optimal keyword placement, meta description length, and hashtag count.')
      }
    ];

    const overallScore = Math.round(checks.reduce((acc, c) => acc + c.score, 0) / checks.length);
    const passed = checks.every(c => c.passed);

    // Decision block for publishing/review loops
    let actionTaken: QACheckResult['actionTaken'] = passed ? 'scheduled' : 'sent_to_review';

    if (!passed) {
      if (retryAttempt < 1) {
        console.warn(`[QualityControlService] QC failed for "${contentItem.title}". Triggering automated repair retry.`);
        // Recurse to simulate retry
        return this.validate({
          ...contentItem,
          title: contentItem.title + ' (Auto-Corrected)',
          data: { ...contentItem.data, repaired: true }
        }, retryAttempt + 1);
      } else {
        console.error(`[QualityControlService] QC failed after retries for "${contentItem.title}". Routing to Manual Review Queue.`);
        actionTaken = 'sent_to_review';
      }
    }

    return {
      passed,
      score: overallScore,
      retryCount: retryAttempt,
      checks,
      overallFeedback: passed 
        ? 'All automated audits passed. Excellent output quality.' 
        : 'Automated review flagged potential copyright or safety risks. Manual approval required.',
      actionTaken
    };
  }

  private evaluateMetric(baseScore: number, feedback: string) {
    const passed = baseScore >= 80;
    return {
      passed,
      score: baseScore,
      feedback
    };
  }
}
