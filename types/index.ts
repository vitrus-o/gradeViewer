export interface Grade {
    offer: {
        subject: {
            subject_no: string;
            description: string;
        }
    };
    grade_status: {
        final: {
            status: number;
            status_label: string;
            submitted: string | null;
            remark?: string;
        }
    }
    grade?: {
                midterm: string;
                final: string;
                completion: string | null;
                remark: string | null;
            },
}