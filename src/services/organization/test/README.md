# Test Submissions API

This module provides services for retrieving test submissions data.

## Endpoints

### Get Test Submissions

Retrieves all submissions for a specific test.

```
GET /api/organization/tests/:testId/submissions
```

#### Response

```json
{
  "submissions": [
    {
      "id": "string",
      "name": "string",
      "email": "string",
      "totalQuestions": 60,
      "answered": 45,
      "correct": 40,
      "wrong": 5,
      "unanswered": 15,
      "submittedAt": "2023-06-15T10:30:00Z",
      "score": 67,
      "rank": 1,
      "sectionAnswers": {
        "section1": 15,
        "section2": 15,
        "section3": 15
      },
      "sectionCorrect": {
        "section1": 14,
        "section2": 13,
        "section3": 13
      },
      "sectionWrong": {
        "section1": 1,
        "section2": 2,
        "section3": 2
      }
    }
  ],
  "sections": [
    {
      "id": "section1",
      "name": "Basic Knowledge",
      "questionsCount": 20
    },
    {
      "id": "section2",
      "name": "Technical Skills",
      "questionsCount": 20
    },
    {
      "id": "section3",
      "name": "Problem Solving",
      "questionsCount": 20
    }
  ],
  "timestamp": "2023-06-15T10:35:00Z"
}
```

## Data Models

### Submission

```typescript
type Submission = {
  id: string
  name: string
  email: string
  totalQuestions: number
  answered: number
  correct: number
  wrong: number
  unanswered: number
  submittedAt: string
  score: number
  rank: number
  sectionAnswers: {
    [key: string]: number // sectionId: number of answers
  }
  sectionCorrect: {
    [key: string]: number // sectionId: number of correct answers
  }
  sectionWrong: {
    [key: string]: number // sectionId: number of wrong answers
  }
}
```

### Section

```typescript
type Section = {
  id: string
  name: string
  questionsCount: number
}
```

## Implementation Notes

- The implementation fetches all sections, attempts, user information, and answers for a specific test.
- It calculates scores and ranks for each submission based on correct answers.
- Submissions are sorted by score in descending order.
- Section-specific data is provided for detailed analysis.

## Future Enhancements

- Real-time updates using Server-Sent Events (SSE) could be implemented in the future.
- Pagination for large datasets.
- Filtering and sorting options on the server side.
